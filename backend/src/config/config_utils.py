import json

json_data = {}
loaded = False


def load():
    global loaded
    with open("general_config.json") as file:
        data = json.load(file)
        json_data["general"] = json.dumps(data)

    with open("groups_config.json") as file:
        data = json.load(file)
        json_data["groups"] = json.dumps(data)

    with open("meeting_config.json") as file:
        data = json.load(file)
        json_data["meeting"] = json.dumps(data)

    loaded = True


def gather_json():
    if not loaded:
        load()

    return json_data


def save_json(file):
    pass
