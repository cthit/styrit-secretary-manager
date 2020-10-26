from flask import Flask, request
from flask_cors import CORS
from flask_restful import Api, Resource
from pony.orm import db_session

from config import config_handler
from process.ArchiveProcess import download_archive, get_archive_url
from process.CodeProcess import handle_code_request
from process.ConfigProcess import handle_incoming_config
from process.FileProcess import handle_file_request
from process.MailProcess import handle_email
from process.MeetingProcess import handle_meeting_config
from process.StoryEmailRes import handle_story_email
from process.StoryProcess import handle_stories
from process.TimerProcess import handle_start_timer
from validation.PasswordValidation import validate_password

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


# If the given password is valid, updates the servers configs.
class AdminResource(Resource):
    def post(self):
        data = request.get_json()
        pass_validation = validate_password(data)
        if pass_validation.is_error():
            return pass_validation.get_response()

        return handle_incoming_config(data).get_response()


# If the given password is valid, updates / adds the given meeting configs.
class MeetingResource(Resource):
    def post(self):
        data = request.get_json()
        pass_validation = validate_password(data)
        if pass_validation.is_error():
            return pass_validation.get_response()

        return handle_meeting_config(data).get_response()


# If the password is valid, updates / adds the given story configs.
class StoriesRes(Resource):
    def post(self):
        data = request.get_json()
        pass_validation = validate_password(data)
        if pass_validation.is_error():
            return pass_validation.get_response()

        return handle_stories(data).get_response()


# If the given password is valid, sends out the emails to active groups for the given meeting.
class MailRes(Resource):
    def put(self):
        data = request.get_json()
        pass_validation = validate_password(data)
        if pass_validation.is_error():
            return pass_validation.get_response()

        return handle_email(data).get_response()


# If the given password is valid, sends out emails for the stories for the given meeting.
class MailStoriesRes(Resource):
    def put(self):
        data = request.get_json()
        pass_validation = validate_password(data)
        if pass_validation.is_error():
            return pass_validation.get_response()

        return handle_story_email(data).get_response()


# If the password is valid, starts a timer for the meeting.
class TimerResource(Resource):
    @db_session
    def post(self, id):
        data = request.get_json()
        pass_validation = validate_password(data)
        if pass_validation.is_error():
            return pass_validation.get_response()

        # The password was accepted, check the meeting id
        return handle_start_timer(id).get_response()


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

    def get(self, id):
        """
        Download the archive for the meeting with the given id (if it exists)
        """
        return download_archive(id).get_response()


class ArchiveUrl(Resource):
    @db_session
    def get(self, id):
        """
        Request that the archive is created without the meeting deadline being reached.
        Returns the archive code
        """
        return get_archive_url(id).get_response()


api.add_resource(FileRes, '/api/file')
api.add_resource(CodeRes, '/api/code/<string:code>')
api.add_resource(MeetingResource, "/api/admin/config/meeting")
api.add_resource(AdminResource, "/api/admin/config")
api.add_resource(PasswordResource, "/api/admin")
api.add_resource(MailStoriesRes, "/api/mail/stories")
api.add_resource(MailRes, "/api/mail")
api.add_resource(TimerResource, "/api/timer/<string:id>")
api.add_resource(ArchiveDownload, "/api/archive/download/<string:id>")
api.add_resource(ArchiveUrl, "/api/archive/url/<string:id>")
api.add_resource(StoriesRes, "/api/admin/config/stories")


def host():
    app.run(host="0.0.0.0")
