from datetime import datetime
from uuid import UUID

from pony import orm
from pony.orm import Database, PrimaryKey, Required, Set, composite_key, Optional, db_session

from config import db_config as config

db = Database()


# A group
class Group(db.Entity):
    name = PrimaryKey(str)
    display_name = Required(str)

    group_meetings = Set("GroupMeeting")


# A general task
class Task(db.Entity):
    name = PrimaryKey(str)
    display_name = Required(str)

    group_tasks = Set("GroupMeetingTask")


# A specific meeting
class Meeting(db.Entity):
    year = Required(int)
    date = Required(datetime)
    last_upload = Required(datetime)
    lp = Required(int)
    meeting_no = Required(int)

    group_meetings = Set("GroupMeeting")
    PrimaryKey(year, lp, meeting_no)


# Contains the code for each group and meeting
class GroupMeeting(db.Entity):
    group = Required(Group)
    meeting = Required(Meeting)
    code = Required(UUID, auto=True, unique=True)

    PrimaryKey(group, meeting)
    group_tasks = Set("GroupMeetingTask")


# The tasks to be done by that Group/Meeting combination
class GroupMeetingTask(db.Entity):
    group = Required(GroupMeeting)
    task = Required(Task)

    PrimaryKey(group, task)
    group_files = Set("GroupMeetingFile")


# The file for a specific task for a specific group/meeting
# Not a part of the groupMeetingTask as the file will be added after the group/meeting/task has been added.
class GroupMeetingFile(db.Entity):
    group_task = PrimaryKey(GroupMeetingTask)
    file_location = Required(str, unique=True)
    date = Required(datetime, default=datetime.utcnow)


# A type of config that can exist.
class ConfigType(db.Entity):
    type = PrimaryKey(str)

    configs = Set("Config")


# Represents a single config entry
class Config(db.Entity):
    key = PrimaryKey(str)
    value = Required(str)
    config_type = Required(ConfigType)


db.bind(
    provider="postgres",
    user=config.POSTGRES_USER,
    password=config.POSTGRES_PASSWORD,
    host=config.POSTGRES_HOST,
    port=config.POSTGRES_PORT,
    database=config.POSTGRES_DB
)

db.generate_mapping(create_tables=True)


# Helper methods
def validate_task(task_json, meeting):
    try:
        name = task_json["name"]
        group = Group[name]
        if group is not None:
            raise Exception("invalid group name " + str(name))

        # task = orm.select(code_task.task for code_task in )
    except Exception as e:
        print("Failed validating task " + str(e))
        return None


@db_session
def validate_meeting(meeting_json):
    try:
        date = datetime.strptime(meeting_json["date"][0:15], "%Y-%m-%dT%H:%M")
        last_upload = datetime.strptime(meeting_json["last_upload_date"][0:15], "%Y-%m-%dT%H:%M")
        lp = meeting_json["lp"]
        if not 0 < lp <= 4:
            raise Exception("invalid lp " + str(lp))
        meeting_no = meeting_json["meeting_no"]
        if not 0 <= meeting_no:
            raise Exception("invalid meeting number " + str(meeting_no))

        meeting = Meeting[date.year, lp, meeting_no]

        # Check all of the tasks...
        tasks = meeting_json["groups_tasks"]

        # We want to select all the tasks for this meeting from the database and match the json to it

        for type in tasks:
            for task in tasks[type]:
                # I want to either check to see if the group has this task type on the meeting
                # If it doesn't we want to create it.
                # If a group

                # Validate the task
                print(type)
                # task = validate_task(task, meeting)
                print(task)

        if meeting is None:
            # The meeting does not yet exist, let's create it
            return Meeting(year=date.year, date=date, last_upload=last_upload, lp=lp, meeting_no=meeting_no)

        meeting.date = date
        meeting.last_upload = last_upload
    except Exception as e:
        print("Failed validating meeting " + str(e))
        return None
