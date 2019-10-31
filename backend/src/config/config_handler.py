from pony import orm
from pony.orm import db_session

from db import Meeting, CodeTasks, CodeGroup, Config, Group, Task, db, validate_meeting


@db_session
def get_config():
    config = {}

    meeting_list = Meeting.select(lambda m: True)
    meeting_jsons = []
    for meeting in meeting_list:
        # Select all codes and tasks
        code_tasks = orm.select((c_t.code, c_t.task) for c_t in CodeTasks)

        tasks = {}
        # Filter out the codes that have the wrong meeting
        for code, task in code_tasks:
            if task.name not in tasks.keys():
                tasks[task.name] = []
            # Select the groups with the code and with the correct meeting
            code_group = CodeGroup.get(code=code.code, meeting=meeting)
            if code_group is None:
                continue

            group = code_group.group
            meeting_name = code_group.meeting
            print(group)
            print(meeting_name)
            tasks[task.name].append({
                "name": code_group.group.name,
                "code": str(code_group.code)
            })

        print("ASD")
        m_js = {
            "lp": meeting.lp,
            "meeting_no": meeting.meeting_no,
            "date": meeting.date.strftime("%Y-%m-%dT%H:%M"),
            "last_upload_date": meeting.last_upload.strftime("%Y-%m-%dT%H:%M"),
            "groups_tasks": tasks
        }

        meeting_jsons.append(m_js)

    config["meetings"] = meeting_jsons

    # Add divider
    config_list = []

    # Add general config
    conf = list(orm.select((config.key, config.value, config.config_type.type) for config in Config))
    for key, value, type in conf:
        config_list.append({"key": key, "value": value, "type": type})

    config["general"] = config_list

    groups = []
    group_list = orm.select((group.name, group.display_name) for group in Group)
    for name, d_name in group_list:
        groups.append({
            "name": name,
            "display_name": d_name
        })

    config["groups"] = groups

    tasks = []
    task_list = orm.select((task.name, task.display_name) for task in Task)
    for name, d_name in task_list:
        tasks.append({
            "name": name,
            "display_name": d_name
        })

    config["tasks"] = tasks
    return config


def handle_incoming_config(config):
    print(config)


def handle_incoming_meeting_config(config):
    meeting = validate_meeting(config)
    if meeting is None:
        return 400, {"error": "Invalid meeting format"}

    # Validate that the config is a meeting