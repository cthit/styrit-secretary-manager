import os

from flask import Flask, request
from flask_cors import CORS
from flask_restful import Api, Resource
from pony import orm
from pony.orm import db_session

from db import CodeGroup, CodeTasks, Task, CodeFile

app = Flask(__name__)
api = Api(app)
cors = CORS(app, resources={r"/*": {"origins": "*"}})


@db_session
def get_data_for_code(code):
    code_group = CodeGroup.get(code=code)

    if code_group is None:
        return {"error": "Missing data for code, please send the files manually"}, 404

    task_tuples = list(orm.select((code_task.task.name, code_task.task.display_name) for code_task in CodeTasks if str(code_task.code.code) == code))
    tasks = []
    for name, d_name in task_tuples:
        tasks.append({
            "codeName": name,
            "displayName": d_name
        })

    return {
        "group": {
            "codeName": code_group.group.name,
            "displayName": code_group.group.display_name
        },
        "study_period": code_group.meeting.lp,
        "year": code_group.meeting.year,
        "meeting_no": code_group.meeting.meeting_no,
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

    print("Saving file " + str(file) + " in " + path)
    file.save(path + "/" + name)

    CodeFile(code=code, task=task, file_location=path)


class CodeRes(Resource):
    @db_session
    def post(self):
        data = request.get_json()
        code = data["code"]
        code_group = CodeGroup.get(code=code)
        if code_group is None:
            codes_list = list(orm.select(code.code for code in CodeGroup))
            for code in codes_list:
                print("Code: " + str(code))

            return {"error": "Code not found"}, 404

        return {
            "code": code,
            "data": get_data_for_code(code)
        }


class FileRes(Resource):
    @db_session
    def put(self):
        print(request.files)
        code = request.form["code"]
        if CodeGroup.get(code=code) is None:
            return {"error":  "Code not found! Please contact the developers of this system."}, 404

        for task in request.files:
            handle_file(code, task, request.files[task])


api.add_resource(FileRes, '/file')
api.add_resource(CodeRes, '/code')

def host():
    app.run(host="0.0.0.0")
