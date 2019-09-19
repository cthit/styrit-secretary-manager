import datetime

from flask import Flask, request
from flask_restful import Resource, Api

from flask_cors import CORS

app = Flask(__name__)
api = Api(app)
app.config['UPLOAD_FOLDER'] = '/uploads'

cors = CORS(app, resources={r"/*": {"origins": "*"}})

class FileResource(Resource):
    def put(self):
        pedero = request
        print(request.files)
        file = request.files['file']
        print("Should save the file?")

        committee = "armit"
        name = ""
        year = datetime.datetime.now().year
        lp = "1"
        type = request.form["type"]

        name = name + "_" + committee + "_" + str(year) + "_" + lp + ".pdf"
        file.save("./uploads/" + name)


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