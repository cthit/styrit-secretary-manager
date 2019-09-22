import json


class CodeInfo:
    def __init__(self, group, lp, year, meeting_no, tasks):
        super()
        self.group = group
        self.study_period = lp
        self.year = year
        self.meeting_no = meeting_no
        self.tasks = tasks

    def to_json(self):
        return json.dumps(self, default=lambda o: o.__dict__,
                          sort_keys=True, indent=4)

    def is_same(self, other):
        try:
            if self.group == other.group and \
                    self.study_period == other.study_period and \
                    self.year == other.year and \
                    self.meeting_no == other.meeting_no and \
                    self.tasks == other.tasks:
                return True
        except AttributeError:
            pass

        return False


def code_info_from_json(json):
    return CodeInfo(json["group"], json["study_period"], json["year"], json["meeting_no"], json["tasks"])


def generate_code(codes):
    code = 0
    while str(code) in codes.keys():
        code += 1

    return str(code)


def get_task_by_name(name, settings):
    for task in settings["tasks"]:
        if task["codeName"] == name:
            return task


def generate_codes(settings):
    codes = {}
    for group in settings["groups"]:
        tasks_for_group = []
        for task in settings["todo_tasks"]:
            for task_group in task["groups"]:
                if group["codeName"] == task_group:
                    for task_name in task["tasks"]:
                        tasks_for_group.append(get_task_by_name(task_name, settings))
        code = generate_code(codes)
        data = CodeInfo(group, settings["lp"], settings["year"], settings["meeting_no"], tasks_for_group)
        codes[code] = data

    return codes
