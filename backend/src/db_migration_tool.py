import json

from pony.orm import db_session

from src.db import ConfigType, Config, Group, GroupMeeting, Meeting, GroupMeetingFile, GroupMeetingTask, Task, \
    ArchiveCode

date_format = "%Y-%m-%d %H:%M:%S"

@db_session
def get_config_types():
    arr = []
    config_types = ConfigType.select()
    for config_type in config_types:
        arr.append({
            "type": config_type.type
        })

    print("===SAVING {0} {1}===".format(len(arr), "ConfigTypes"))
    return arr


@db_session
def get_configs():
    arr = []
    configs = Config.select()
    for config in configs:
        arr.append({
            "key": config.key,
            "value": config.value,
            "type": config.config_type.type
        })

    print("===SAVING {0} {1}===".format(len(arr), "Configs"))
    return arr


@db_session
def get_groups():
    arr = []
    groups = Group.select()
    for group in groups:
        arr.append({
            "name": group.name,
            "display_name": group.display_name
        })

    print("===SAVING {0} {1}===".format(len(arr), "Groups"))
    return arr

@db_session
def get_meetings():
    arr = []
    meetings = Meeting.select()
    for meeting in meetings:
        arr.append({
            "id": str(meeting.id),
            "year": meeting.year,
            "date": meeting.date.strftime(date_format),
            "last_upload": meeting.last_upload.strftime(date_format),
            "lp": meeting.lp,
            "meeting_no": meeting.meeting_no,
            "check_for_deadline": meeting.check_for_deadline
        })

    print("===SAVING {0} {1}===".format(len(arr), "Meetings"))
    return arr


@db_session
def get_group_meetings():
    arr = []
    group_meetings = GroupMeeting.select()
    for meeting in group_meetings:
        arr.append({
            "group": meeting.group.name,
            "meeting": str(meeting.meeting.id),
            "code": str(meeting.code)
        })

    print("===SAVING {0} {1}===".format(len(arr), "GroupMeetings"))
    return arr


@db_session
def get_tasks():
    arr = []
    tasks = Task.select()
    for task in tasks:
        arr.append({
            "name": task.name,
            "display_name": task.display_name
        })

    print("===SAVING {0} {1}===".format(len(arr), "Tasks"))
    return arr


@db_session
def get_group_meeting_tasks():
    arr = []
    group_meeting_tasks = GroupMeetingTask.select()
    for group_meeting_task in group_meeting_tasks:
        arr.append({
            "group": group_meeting_task.group.group.name,
            "meeting": str(group_meeting_task.group.meeting.id),
            "task": group_meeting_task.task.name
        })

    print("===SAVING {0} {1}===".format(len(arr), "GroupMeetingTasks"))
    return arr


@db_session
def get_group_meeting_files():
    arr = []
    group_meeting_files = GroupMeetingFile.select()
    for group_meeting_file in group_meeting_files:
        arr.append({
            "group": group_meeting_file.group_task.group.group.name,
            "meeting": str(group_meeting_file.group_task.group.meeting.id),
            "task": group_meeting_file.group_task.task.name,
            "file_location": group_meeting_file.file_location,
            "date": group_meeting_file.date.strftime(date_format)
        })

    print("===SAVING {0} {1}===".format(len(arr), "GroupMeetingFiles"))
    return arr


@db_session
def get_archive_codes():
    arr = []
    archive_codes = ArchiveCode.select()
    for archive in archive_codes:
        arr.append({
            "meeting": str(archive.meeting.id),
            "archive_location": archive.archive_location,
            "code": str(archive.code)
        })

    print("===SAVING {0} {1}===".format(len(arr), "ArchiveCodes"))
    return arr


def save_tables_to_json():
    db_json = {}

    db_json["config_types"] = get_config_types()
    db_json["configs"] = get_configs()
    db_json["groups"] = get_groups()
    db_json["tasks"] = get_tasks()
    db_json["meetings"] = get_meetings()
    db_json["group_meetings"] = get_group_meetings()
    db_json["group_meeting_tasks"] = get_group_meeting_tasks()
    db_json["group_meeting_files"] = get_group_meeting_files()
    db_json["archive_codes"] = get_archive_codes()

    with open("src/archives/db_backup.json", "w+") as file:
        json.dump(db_json, file)



def backup_db():
    save_tables_to_json()