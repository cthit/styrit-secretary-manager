import datetime
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

cors = CORS(app, resources={r"/*": {"origins": "*"}})


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

        # Prob wanna check the code
        code = request.form["code"]
        committee = request.form["group"]

        for report_type in request.files:
            file = request.files[report_type]
            handle_file(report_type, file, committee, settings["year"], settings["lp"], settings["meeting_no"])


class CodeResource(Resource):
    def post(self):
        json = request.get_json()
        if (json["code"] == "123123"):
            return {
                "code": json["code"],
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
                "error": "Incorrect code"
            }

api.add_resource(FileResource, '/file')
api.add_resource(CodeResource, '/code')

if __name__ == '__main__':
    app.run(host='0.0.0.0')