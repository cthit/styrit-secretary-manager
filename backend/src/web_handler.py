import datetime
import os

from flask import Flask, request
from flask_cors import CORS
from flask_restful import Api, Resource
from pony import orm
from pony.orm import db_session

import private_keys
from config import general_config, config_handler
from db import Task, GroupMeeting, GroupMeetingTask, GroupMeetingFile

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
    task_obj = Task.get(name=task)
    data = get_data_for_code(code)
    if task_obj is None:
        return {"error": "Report type not found: " + str(task)}, 404

    committee = data["group"]["codeName"]
    year = str(data["year"])
    lp = str(data["study_period"])

    name = task + "_" + committee + "_" + year + "_" + lp + ".pdf"
    path = "./uploads/" + year + "/lp" + lp + "/" + str(data["meeting_no"]) + "/" + str(committee)

    if not os.path.exists(path):
        os.makedirs(path)

    save_loc = path + "/" + name

    print("Saving file " + str(file) + " in " + path)
    file.save(save_loc)

    group_task = GroupMeetingTask.get(lambda group_task: str(group_task.group.code) == code)
    group_file = GroupMeetingFile.get(group_task=group_task)
    if group_file is None:
        GroupMeetingFile(group_task=group_task, file_location=save_loc)
        return {"overwrite": False}
    else:
        print("OVERWRITE!")
        group_file.date = datetime.datetime.now()
        return {"overwrite": True}


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

        current_date = datetime.datetime.now()
        if group_meeting.meeting.last_upload < current_date:
            return {"error": "Code expired, please contact me at " + general_config.my_email}

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

        for task in request.files:
            return handle_file(code, task, request.files[task])


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

        config_handler.handle_incoming_config(config)
        return {"ok": "ok"}, 200


class MeetingResource(Resource):
    def post(self):
        config = request.get_json()
        r, code = validate_password(config)
        if code != 200:
            return r, code

        status, message = config_handler.handle_incoming_meeting_config(config["meeting"])
        return message, status


class PasswordResource(Resource):
    def put(self):
        response_json = request.get_json()
        r, code = validate_password(response_json)
        if code != 200:
            return r, code

        configs = config_handler.get_config()
        return configs, 200


api.add_resource(FileRes, '/file')
api.add_resource(CodeRes, '/code')
api.add_resource(MeetingResource, "/admin/config/meeting")
api.add_resource(AdminResource, "/admin/config")
api.add_resource(PasswordResource, "/admin")


def host():
    app.run(host="0.0.0.0")
