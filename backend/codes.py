class CodeInfo:
    def __init__(self, group, lp, year, meeting_no, tasks):
        super()
        self.group = group
        self.study_period = lp
        self.year = year
        self.meeting_no = meeting_no
        self.tasks = tasks

    def to_json(self):
        first = True
        tasks = "[\n"
        for task in self.tasks:
            if first:
                first = False
            else:
                tasks += ",\n"
            tasks += "{"
            tasks += "codeName: " + task["codeName"] + ",\n"
            tasks += "displayName: " + task["displayName"] + "\n"
            tasks += "}"

        tasks += "]"
        return {
            "group": {
                "codeName": self.group["codeName"],
                "displayName": self.group["displayName"]
            },
            "tasks": self.tasks
        }

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
            if group["codeName"] in task["groups"]:
                for task_name in task["tasks"]:
                    tasks_for_group.append(get_task_by_name(task_name, settings))
                tasks_for_group.append(task["tasks"])
        code = generate_code(codes)
        data = CodeInfo(group, settings["lp"], settings["year"], settings["meeting_no"], tasks_for_group)
        codes[code] = data

    return codes