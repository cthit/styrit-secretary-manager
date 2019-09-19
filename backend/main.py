import datetime
import os

from flask import Flask, request
from flask_restful import Resource, Api

from flask_cors import CORS

app = Flask(__name__)
api = Api(app)
app.config['UPLOAD_FOLDER'] = '/uploads'
lp = "1"

cors = CORS(app, resources={r"/*": {"origins": "*"}})


def handle_file(report_type, file, committee, year, lp):
    name = report_type + "_" + committee + "_" + str(year) + "_" + lp + ".pdf"

    path = "./uploads/" + str(year)
    #if not os.path.exists(path):
    #    os.mkdir(path)

    path = path + "/lp" + str(lp)
    #if not os.path.exists(path):
    #    os.mkdir(path)

    path = path + "/" + committee
    #if not os.path.exists(path):
    #    os.mkdir(path)

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
        year = datetime.datetime.now().year

        for report_type in request.files:
            file = request.files[report_type]
            handle_file(report_type, file, committee, year, lp)


class CodeResource(Resource):
    def post(self):
        json = request.get_json()
        if (json["code"] == "123123"):
            return {
                "code": json["code"],
                "group": "armit",
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