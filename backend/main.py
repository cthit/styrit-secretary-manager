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
        file = request.files['file']
        print("Should save the file?")
        file.save("./uploads/" + file.filename + ".pdf")

api.add_resource(FileResource, '/')

if __name__ == '__main__':
    app.run(host='0.0.0.0')