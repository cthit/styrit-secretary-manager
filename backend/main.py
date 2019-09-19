import datetime
import json
import os

from flask import Flask, request
from flask_restful import Resource, Api

from flask_cors import CORS


app = Flask(__name__)
api = Api(app)
app.config['UPLOAD_FOLDER'] = '/uploads'

settings = {
    "lp": 0,
    "meeting_no": 0,
    "year": 2019
}

cors = CORS(app, resources={r"/api/*": {"origins": "*"}})


def handle_file(report_type, file, committee, year, lp, meeting_no):
    name = report_type + "_" + committee + "_" + str(year) + "_" + lp + ".pdf"

    path = "./uploads/" + str(year) + "/lp" + str(lp) + "_" + str(meeting_no) + "/" + committee

    if not os.path.exists(path):
        os.makedirs(path)

    print("Saving file: " + name + "\nIn: " + path)
    file.save(path + "/" + name)


class FileResource(Resource):
    def put(self):
        pedero = request
        print(request.files)
        print("Should save the file?")

        # Prob wanna check the codes
        code = request.form["codes"]
        committee = request.form["group"]

        for report_type in request.files:
            file = request.files[report_type]
            handle_file(report_type, file, committee, settings["year"], settings["lp"], settings["meeting_no"])


class CodeResource(Resource):
    def post(self):
        json = request.get_json()
        if (json["codes"] == "123123"):
            return {
                "codes": json["codes"],
                "group": {
                    "codeName": "armit",
                    "displayName": "ArmIT"
                },
                "tasks": {
                    "Verksamhetsplan": "vplan",
                    "Budget": "budget",
                    "Verksamhetsrapport": "vrapport",
                }
            }
        else:
            return {
                "error": "Incorrect codes"
            }


class CodeInfo:
    def __init__(self):
        super(self)

    def to_json(self):
        return {}


def prepare_for_meeting():
    global settings
    with open("config.json") as json_file:
        data = json.load(json_file)
        settings["lp"] = data["study_period"]
        settings["meeting_no"] = data["meeting_no"]
        settings["year"] = data["year"]


api.add_resource(FileResource, '/file')
api.add_resource(CodeResource, '/codes')

if __name__ == '__main__':
    prepare_for_meeting()
    app.run(host='0.0.0.0')