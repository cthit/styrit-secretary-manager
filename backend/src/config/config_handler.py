from pony import orm
from pony.orm import db_session

from db import Meeting, Config, Group, Task, validate_meeting, GroupMeetingTask, GroupMeeting


@db_session
def get_config_for_meeting(meeting):
    # Select all codes and tasks
    groups = GroupMeeting.select(lambda group: group.meeting == meeting)
    tasks = {}

    for group_meeting in groups:
        group_tasks = list(GroupMeetingTask.select(lambda g_t: g_t.group == group_meeting))
        for group_task in group_tasks:
            task = group_task.task
            if task.name not in tasks.keys():
                tasks[task.name] = []

            tasks[task.name].append({
                "name": group_meeting.group.name,
                "code": str(group_meeting.code)
            })

    m_js = {
        "lp": meeting.lp,
        "meeting_no": meeting.meeting_no,
        "date": meeting.date.strftime("%Y-%m-%dT%H:%MZ"),
        "last_upload_date": meeting.last_upload.strftime("%Y-%m-%dT%H:%MZ"),
        "groups_tasks": tasks
    }

    return m_js


@db_session
def get_config():
    config = {}

    meeting_list = Meeting.select(lambda m: True)
    meeting_jsons = []
    for meeting in meeting_list:
        meeting_jsons.append(get_config_for_meeting(meeting))

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


@db_session
def handle_incoming_config(config):
    for entry in config:
        key = entry["key"]
        value = entry["value"]
        db_config = Config.get(key=key)
        if db_config.config_type == "number":
            # Make sure the value is a number
            if not value.isdigit():
                # Ignore the config as it is invalid
                continue

        if db_config is None:
            return "Config " + str(key) + " not found", 404
        db_config.value = value

    return "ok", 200


def handle_incoming_meeting_config(config):
    meeting, msg = validate_meeting(config)
    if meeting is None:
        return 400, {"error": "Invalid meeting format\n" + msg}

    # Probably return the data for the new meeting?
    return 200, get_config_for_meeting(meeting)