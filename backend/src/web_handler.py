import datetime
import os
import threading

from flask import Flask, request, current_app, send_from_directory
from flask_cors import CORS
from flask_restful import Api, Resource
from pony import orm
from pony.orm import db_session

import end_date_handler
import mail_handler
import private_keys
from config import config_handler
from db import Task, GroupMeeting, GroupMeetingTask, GroupMeetingFile, Meeting, ArchiveCode, Config

app = Flask(__name__)
api = Api(app)
cors = CORS(app, resources={r"/*": {"origins": "*"}})


@db_session
def get_data_for_code(code):
    group_meeting = GroupMeeting.get(lambda group: str(group.code) == code)

    if group_meeting is None:
        return {"error": "Missing data for code, please send the files manually"}, 404

    task_tuples = list(orm.select(
        (group_task.task.name, group_task.task.display_name) for group_task in GroupMeetingTask if
        str(group_task.group.code) == code))
    tasks = []
    for name, d_name in task_tuples:
        tasks.append({
            "codeName": name,
            "displayName": d_name
        })

    return {
        "group": {
            "codeName": group_meeting.group.name,
            "displayName": group_meeting.group.display_name
        },
        "study_period": group_meeting.meeting.lp,
        "year": group_meeting.meeting.year,
        "meeting_no": group_meeting.meeting.meeting_no,
        "tasks": tasks
    }


def handle_file(code, task, file):
    """
    Saves the file to the disk and stores it's location in the database
    """
    task_obj = Task.get(name=task)
    data = get_data_for_code(code)
    if task_obj is None:
        return {"error": "Report type not found: " + str(task)}, 404

    committee = data["group"]["codeName"]
    year = str(data["year"])
    lp = str(data["study_period"])
    meeting_no = str(data["meeting_no"])
    name = task + "_" + committee + "_" + year + "_" + lp + ".pdf"
    path = "./uploads/" + year + "/lp" + lp + "/" + meeting_no + "/" + str(committee)

    if not os.path.exists(path):
        os.makedirs(path)

    save_loc = path + "/" + name
    print("Saving file " + str(file) + " in " + path)
    file.save(save_loc)
    group_task = GroupMeetingTask.get(
        lambda group_task: str(group_task.group.code) == code and group_task.task == task_obj)
    group_file = GroupMeetingFile.get(group_task=group_task)

    if group_file is None:
        GroupMeetingFile(group_task=group_task, file_location=save_loc)
        return False
    else:
        print("Overwriting file " + group_file.file_location + " from " + str(group_file.date) + " (GMT)")
        group_file.date = datetime.datetime.utcnow()
        return True


class CodeRes(Resource):
    @db_session
    def post(self):
        data = request.get_json()
        code = data["code"]
        try:
            group_meeting = GroupMeeting.get(lambda group: str(group.code) == code)
        except ValueError as err:
            return {"error": "Bad code format"}, 400

        if group_meeting is None:
            codes_list = list(orm.select(group.code for group in GroupMeeting))
            for code in codes_list:
                print("Code: " + str(code))

            return {"error": "Code not found"}, 404

        current_date = datetime.datetime.utcnow()
        if group_meeting.meeting.last_upload < current_date:
            return {"error": "Code expired, please contact me at " + Config["secretary_email"].value}

        return {
            "code": code,
            "data": get_data_for_code(code)
        }


class FileRes(Resource):
    @db_session
    def put(self):
        print(request.files)
        code = request.form["code"]
        if GroupMeeting.select(lambda group: str(group.code) == code) is None:
            return {"error": "Code not found! Please contact the developers of this system."}, 404

        overwrite = False
        for task in request.files:
            if handle_file(code, task, request.files[task]):
                overwrite = True
        return {"overwrite": overwrite}


def validate_password(response_json):
    if "pass" not in response_json:
        return {
                   "Error": "Bad Request"
               }, 400
    password = response_json["pass"]
    if password != private_keys.frontend_admin_pass:
        return {
                   "Error": "Invalid password"
               }, 401
    return {}, 200


class AdminResource(Resource):
    def post(self):
        config = request.get_json()
        r, code = validate_password(config)
        if code != 200:
            return r, code

        msg, status = config_handler.handle_incoming_config(config["config"])
        return msg, status


class MeetingResource(Resource):
    def post(self):
        config = request.get_json()
        r, code = validate_password(config)
        if code != 200:
            return r, code

        status, message = config_handler.handle_incoming_meeting_config(config["meeting"])
        return message, status


class MailRes(Resource):
    @db_session
    def put(self):
        data = request.get_json()
        r, code = validate_password(data)
        if code != 200:
            return r, code

        # The password was accepted! Try to figure out which meeting it wants to send the email for.
        try:
            year = data["year"]
            lp = data["lp"]
            meeting_no = data["meeting_no"]
            meeting = Meeting[year, lp, meeting_no]
        except Exception as e:
            print("Unable to validate meeting " + str(e))
            return "Unable to validate meeting", 400

        if meeting is None:
            return "Unable to find meeting", 404

        threading.Thread(target=mail_handler.send_mails, args=(meeting,)).start()
        threading.Thread(target=end_date_handler.send_final_mail, args=(meeting,)).start()


class PasswordResource(Resource):
    def put(self):
        response_json = request.get_json()
        r, code = validate_password(response_json)
        if code != 200:
            return r, code

        configs = config_handler.get_config()
        return configs, 200


class ArchiveDownload(Resource):
    @db_session
    def get(self, id):
        archive = ArchiveCode.get(code=id)
        if archive is None:
            return 404

        file_name = "documents_lp2_0_2019.zip"
        #        file = "." + archive.archive_location
        #        file = os.path.join(current_app.root_path, archive.archive_location)

        directory = os.path.join(current_app.root_path, "../archives")
        return send_from_directory(directory, file_name)


api.add_resource(FileRes, '/file')
api.add_resource(CodeRes, '/code')
api.add_resource(MeetingResource, "/admin/config/meeting")
api.add_resource(AdminResource, "/admin/config")
api.add_resource(PasswordResource, "/admin")
api.add_resource(MailRes, "/mail")
api.add_resource(ArchiveDownload, "/archive/<string:id>")


def host():
    app.run(host="0.0.0.0")
