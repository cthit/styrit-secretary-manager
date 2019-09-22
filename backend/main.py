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
    "year": 2019,
    "taken_codes": []
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
        data = request.get_json()
        if data["code"] in code_list:
            print("Ok code!")
            return {
                "code": data["code"],
                "data": json.loads(code_list[data["code"]].to_json())
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
    # Read the general config file and add it to the settings.
    with open("config/config.json") as json_file:
        data = json.load(json_file)
        settings["groups"] = data["groups"]
        # Create a list of all the groups for ease of use.
        group_list = []
        for group in settings["groups"]:
            group_list.append(group["codeName"])

        settings["group_list"] = group_list
        settings["tasks"] = data["tasks"]

    # Read the meeting-specific config file and add it to the settings
    with open("config/meeting_config.json") as json_file:
        data = json.load(json_file)
        settings["lp"] = data["study_period"]
        settings["meeting_no"] = data["meeting_no"]
        settings["year"] = data["year"]
        settings["todo_tasks"] = data["tasks_to_be_done"]
        for i in range(0, len(settings["todo_tasks"])):
            task = settings["todo_tasks"][i]
            if task["groups"] == "all":
                settings["todo_tasks"][i]["groups"] = settings["group_list"]


def get_codes_json():
    codes_json = "{"
    first = True
    for code in code_list:
        if not first:
            codes_json += ","
        else:
            first = False

        codes_json += '"' + code + '":' + str(code_list[code].to_json())

    codes_json += "}"
    codes_json = json.loads(codes_json)
    return json.dumps(codes_json, indent=4, sort_keys=True)


def load_code_list():
    global settings
    with open("config/codes.json") as file:
        json_data = json.load(file)
        code_list = {}
        new_codes = codes.generate_codes(settings)
        for code in json_data:
            code_list[code] = codes.code_info_from_json(json_data[code])
            same = None
            for new_code in new_codes:
                if code_list[code].is_same(new_codes[new_code]):
                    same = new_code

            # Remove all codes that already have duplicates
            if same is not None:
                del new_codes[same]

        return code_list


def prepare_for_meeting():
    global settings
    global code_list
    # First load the already existing codes
    code_list = load_code_list()
    codes_json = get_codes_json()

    with open("config/codes.json", "w") as file:
        file.write(codes_json)
        file.close()


api.add_resource(FileResource, '/file')
api.add_resource(CodeResource, '/code')

if __name__ == '__main__':
    load_configs()
    prepare_for_meeting()
    app.run(host='0.0.0.0')
