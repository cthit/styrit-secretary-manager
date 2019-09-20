import datetime
import json
import os

from flask import Flask, request
from flask_restful import Resource, Api

from flask_cors import CORS

from backend import codes

app = Flask(__name__)
api = Api(app)

settings = {
    "lp": 0,
    "meeting_no": 0,
    "year": 2019
}

code_list = {}

cors = CORS(app, resources={r"/*": {"origins": "*"}})


def handle_file(report_type, file, committee, year, lp, meeting_no):
    name = report_type + "_" + committee + "_" + str(year) + "_" + str(lp) + ".pdf"

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
        code = request.form["code"]
        committee = request.form["group"]

        for report_type in request.files:
            file = request.files[report_type]
            handle_file(report_type, file, committee, settings["year"], settings["lp"], settings["meeting_no"])


class CodeResource(Resource):
    def post(self):
        json = request.get_json()
        if json["code"] in code_list:
            print("Ok code!")
            # return {
            #     "code": json["code"],
            #     "data": code_list[json["code"]].to_json()
            # }

            return {
                "code": json["code"],
                "group": {
                    "codeName": "armit",
                    "displayName": "ArmIT"
                },
                "data": {
                    "tasks": {
                        "Verksamhetsplan": "vplan",
                        "Budget": "budget",
                        "Verksamhetsrapport": "vrapport"
                    }
                }
            }
        else:
            print("Invalid code")
            list_of_codes = ""
            for code in code_list:
                list_of_codes += str(code) + ", ";
            print("Ok codes: " + list_of_codes)
            return {
                "error": "Invalid code"
            }


def load_configs():
    global settings
    with open("config/config.json") as json_file:
        data = json.load(json_file)
        settings["groups"] = data["groups"]
        # Create a list of all the groups for ease of use.
        group_list = []
        for group in settings["groups"]:
            group_list.append(group)

        settings["group_list"] = group_list
        settings["tasks"] = data["tasks"]

    with open("config/meeting_config.json") as json_file:
        data = json.load(json_file)
        settings["lp"] = data["study_period"]
        settings["meeting_no"] = data["meeting_no"]
        settings["year"] = data["year"]
        settings["todo_tasks"] = data["tasks_to_be_done"]
        for task in settings["todo_tasks"]:
            if task["groups"] == "all":
                task["groups"] = settings["group_list"]



def prepare_for_meeting():
    global settings
    global code_list
    code_list = codes.generate_codes(settings)
    codes_string = ""
    for code in code_list:
        codes_string += code + ", "
    print("Generated " + str(len(code_list)) + " codes, they are: " + codes_string)



api.add_resource(FileResource, '/file')
api.add_resource(CodeResource, '/code')

if __name__ == '__main__':
    load_configs()
    prepare_for_meeting()
    app.run(host='0.0.0.0')
