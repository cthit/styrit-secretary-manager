import datetime
import os
import threading
from typing import Dict

from flask import Flask, request, send_file
from flask_cors import CORS
from flask_restful import Api, Resource
from pony import orm
from pony.orm import db_session

import end_date_handler
import mail_handler
from HttpResponse import HttpResponse, get_with_error, get_with_data
from config import config_handler
from db import Task, GroupMeeting, GroupMeetingTask, GroupMeetingFile, Meeting, ArchiveCode, Config
from process.CodeProcess import get_data_for_code, handle_code_request
from process.FileProcess import handle_file_request

app = Flask(__name__)
api = Api(app)
cors = CORS(app, resources={r"/*": {"origins": "*"}})


# Validate code, return data associated with a validated code.
class CodeRes(Resource):
    def post(self, code):
        return handle_code_request(code).get_response()


# Uploads one or a number of files, requires a valid code.
class FileRes(Resource):
    def put(self):
        print(request.files)
        code = request.form["code"]
        return handle_file_request(code, request.files).get_response()


# Validates an admin password.
def validate_password(response_json: Dict) -> HttpResponse:
    if response_json is None or "pass" not in response_json:
        return get_with_error(400, "Bad Request")
    password = response_json["pass"]
    correct_password = os.environ.get("frontend_admin_pass", "asd123")
    if password != correct_password:
        return get_with_error(401, "Invalid password")
    return get_with_data({})


# If the given password is valid, updates the servers configs.
class AdminResource(Resource):
    def post(self):
        data = request.get_json()
        pass_validation = validate_password(data)
        if pass_validation.is_error():
            return pass_validation.get_response()

        msg, status = config_handler.handle_incoming_config(data["config"])
        return msg, status


# If the given password is valid, updates / adds the given meeting configs.
class MeetingResource(Resource):
    def post(self):
        data = request.get_json()
        pass_validation = validate_password(data)
        if pass_validation.is_error():
            return pass_validation.get_response()

        status, message = config_handler.handle_incoming_meeting_config(data["meeting"])
        return message, status


class StoriesRes(Resource):
    def post(self):
        data = request.get_json()
        pass_validation = validate_password(data)
        if pass_validation.is_error():
            return pass_validation.get_response()

        status, message = config_handler.handle_incoming_stories_config(data["storyGroups"])
        return message, status


# If the given password is valid, sends out the emails for the given meeting.
class MailRes(Resource):
    @db_session
    def put(self):
        data = request.get_json()
        pass_validation = validate_password(data)
        if pass_validation.is_error():
            return pass_validation.get_response()

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


class MailStoriesRes(Resource):
    def put(self):
        data = request.get_json()
        pass_validation = validate_password(data)
        if pass_validation.is_error():
            return pass_validation.get_response()

        try:
            id = data["id"]
        except Exception as e:
            return {"error": "Missing meeting id"}, 400

        threading.Thread(target=mail_handler.send_story_emails, args=(id,)).start()


# If the password is valid, starts a timer for the meeting.
class TimerResource(Resource):
    @db_session
    def post(self, id):
        data = request.get_json()
        pass_validation = validate_password(data)
        if pass_validation.is_error():
            return pass_validation.get_response()

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
        data = request.get_json()
        pass_validation = validate_password(data)
        if pass_validation.is_error():
            return pass_validation.get_response()

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
api.add_resource(MailStoriesRes, "/api/mail/stories")
api.add_resource(MailRes, "/api/mail")
api.add_resource(TimerResource, "/api/timer/<string:id>")
api.add_resource(ArchiveDownload, "/api/archive/<string:id>")
api.add_resource(StoriesRes, "/api/admin/config/stories")


def host():
    app.run(host="0.0.0.0")
