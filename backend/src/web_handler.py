import datetime
import os
import threading
import uuid

from flask import Flask, request, current_app, send_from_directory, send_file, redirect
from flask_cors import CORS
from flask_restful import Api, Resource
from pony import orm
from pony.orm import db_session

import end_date_handler
import mail_handler

from config import config_handler
from db import Task, GroupMeeting, GroupMeetingTask, GroupMeetingFile, Meeting, ArchiveCode, Config

app = Flask(__name__)
api = Api(app)
cors = CORS(app, resources={r"/*": {"origins": "*"}})


@db_session
def get_data_for_code(code):
    group_meeting = GroupMeeting.get(lambda group: str(group.code) == code)

    if group_meeting is None:
        return None

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
            "codeName": group_meeting.group.group.name,
            "displayName": group_meeting.group.group.display_name
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
    if task_obj is None:
        return {"error": "Report type not found: " + str(task)}, 404

    data = get_data_for_code(code)
    if data is None:
        return {"error": "Unable to find meeting for code"}, 404

    committee = data["group"]["codeName"]
    year = str(data["year"])
    lp = str(data["study_period"])
    meeting_no = str(data["meeting_no"])
    name = task + "_" + committee + "_" + year + "_" + lp + ".pdf"
    path = "src/uploads/" + year + "/lp" + lp + "/" + meeting_no + "/" + str(committee)

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
        return False, 200
    else:
        print("Overwriting file " + group_file.file_location + " from " + str(group_file.date) + " (GMT)")
        group_file.date = datetime.datetime.utcnow()
        return True, 200


# Validate code, return data associated with a validated code.
class CodeRes(Resource):
    @db_session
    def post(self, code):
        try:
            group_meeting = GroupMeeting.get(lambda group: str(group.code) == code)
        except ValueError as err:
            return {"error": "Bad code format"}, 400

        if group_meeting is None:
            codes_list = list(orm.select(group.code for group in GroupMeeting))

            return {"error": "Code not found"}, 404

        current_date = datetime.datetime.utcnow()
        if group_meeting.meeting.last_upload < current_date:
            return {"error": "Code expired, please contact me at " + Config["secretary_email"].value}, 401

        return {
            "code": code,
            "data": get_data_for_code(code)
        }


# Uploads a or a number of files, requires a valid code.
class FileRes(Resource):
    @db_session
    def put(self):
        print(request.files)
        code = request.form["code"]
        if GroupMeeting.select(lambda group: str(group.code) == code) is None:
            return {"error": "Code not found! Please contact the developers of this system."}, 404

        overwrite = False
        for task in request.files:
            r, status_code = handle_file(code, task, request.files[task])
            if status_code != 200:
                return r, status_code

            overwrite = r

        return {"overwrite": overwrite}


# Validates an admin password.
def validate_password(response_json):
    if response_json is None or "pass" not in response_json:
        return {"error": "Bad Request"}, 400
    password = response_json["pass"]
    frontend_admin_pass = os.environ.get("frontend_admin_pass", "asd123")
    if password != frontend_admin_pass:
        return {"error": "Invalid password"}, 401
    return {}, 200


# If the given password is valid, updates the servers configs.
class AdminResource(Resource):
    def post(self):
        config = request.get_json()
        r, code = validate_password(config)
        if code != 200:
            return r, code

        msg, status = config_handler.handle_incoming_config(config["config"])
        return msg, status


# If the given password is valid, updates / adds the given meeting configs.
class MeetingResource(Resource):
    def post(self):
        config = request.get_json()
        r, code = validate_password(config)
        if code != 200:
            return r, code

        status, message = config_handler.handle_incoming_meeting_config(config["meeting"])
        return message, status


class StoriesRes(Resource):
    def post(self):
        config = request.get_json()
        r, code = validate_password(config)
        if code != 200:
            return r, code

        status, message = config_handler.handle_incoming_stories_config(config["storyGroups"])
        return message, status


# If the given password is valid, sends out the emails for the given meeting.
class MailRes(Resource):
    @db_session
    def put(self):
        data = request.get_json()
        r, code = validate_password(data)
        if code != 200:
            return r, code

        # The password was accepted! Try to figure out which meeting it wants to send the email for.
        try:
            id = data["id"]
            meeting = Meeting.get(id=id)
            if meeting is None:
                raise Exception("unable to find meeting with id " + id)
        except Exception as e:
            print("Unable to validate meeting " + str(e))
            return {"error": "Unable to validate meeting"}, 400

        threading.Thread(target=mail_handler.send_mails, args=(meeting,)).start()


# If the password is valid, starts a timer for the meeting.
class TimerResource(Resource):
    @db_session
    def post(self, id):
        data = request.get_json()
        r, code = validate_password(data)
        if code != 200:
            return r, code

        # The password was accepted, check the meeting id
        meeting = Meeting.get(id=id)
        if meeting is None:
            return {"error": "Meeting with id " + str(id) + " not found"}, 404

        # Meeting is valid, set the flag in the database for checking the deadline for the meeting
        print("Starting to check for deadline for meeting with id: " + str(id))
        meeting.check_for_deadline = True


# If the password is valid, returns the complete current configs.
class PasswordResource(Resource):
    def put(self):
        response_json = request.get_json()
        r, code = validate_password(response_json)
        if code != 200:
            return r, code

        configs = config_handler.get_config()
        return configs, 200


# Handles downloading of archives for meetings.
class ArchiveDownload(Resource):
    """
    Download a zip file with all the documents for the meeting with the given id.
    """

    @db_session
    def get(self, id):
        """
        Download the archive for the meeting with the given id (if it exists)
        """
        try:
            archive = ArchiveCode.get(code=id)
        except ValueError:
            archive = None

        if archive is None:
            return {"error": "Archive not found"}, 404

        file_name = archive.archive_location + ".zip"
        file_path_name = os.path.normpath(file_name)
        num = archive.meeting.meeting_no
        lp = archive.meeting.lp
        year = archive.meeting.year
        print("DOWNLOADING FILE: " + str(file_path_name))
        name = "documents_" + str(num) + "_lp" + str(lp) + "_" + str(year) + ".zip"
        return send_file(file_path_name, as_attachment=True, attachment_filename=name)

    @db_session
    def post(self, id):
        """
        Request that the archive is created without the meeting deadline being reached.
        Returns the archive code
        """
        try:
            meeting = Meeting.get(id=id)
        except ValueError:
            meeting = None

        if meeting is None:
            return {"error": "Meeting not found"}, 404

        archive = end_date_handler.create_archive(meeting)

        # Return a redirect to the archive download location
        base_url = Config["archive_base_url"].value
        redirect_url = base_url + str(archive.code)
        print("Should redirect to " + redirect_url)
        return redirect_url


api.add_resource(FileRes, '/api/file')
api.add_resource(CodeRes, '/api/code/<string:code>')
api.add_resource(MeetingResource, "/api/admin/config/meeting")
api.add_resource(AdminResource, "/api/admin/config")
api.add_resource(PasswordResource, "/api/admin")
api.add_resource(MailRes, "/api/mail")
api.add_resource(TimerResource, "/api/timer/<string:id>")
api.add_resource(ArchiveDownload, "/api/archive/<string:id>")
api.add_resource(StoriesRes, "/api/admin/config/stories")


def host():
    app.run(host="0.0.0.0")
