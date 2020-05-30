from datetime import datetime
from uuid import UUID

import dateutil.parser
from pony.orm import Database, PrimaryKey, Required, Set, Optional, db_session, commit, InternalError, ProgrammingError

from config import db_config as config

db = Database()


# A group
class Group(db.Entity):
    name = PrimaryKey(str)
    display_name = Required(str)

    group_years = Set("GroupYear")


# A group connected with a year
class GroupYear(db.Entity):
    group = Required(Group)
    year = Required(str)
    finished = Required(bool)  # Weather or not they have been relieved of responsibility.

    PrimaryKey(group, year)

    group_meetings = Set("GroupMeeting")


# A general task
class Task(db.Entity):
    name = PrimaryKey(str)
    display_name = Required(str)

    group_tasks = Set("GroupMeetingTask")


# A specific meeting
class Meeting(db.Entity):
    id = PrimaryKey(UUID, auto=True)
    year = Required(int)
    date = Required(datetime)
    last_upload = Required(datetime)
    lp = Required(int)
    meeting_no = Required(int)
    check_for_deadline = Required(bool)

    group_meetings = Set("GroupMeeting")
    archive = Optional("ArchiveCode")


# Contains the code for each group and meeting
class GroupMeeting(db.Entity):
    group = Required(GroupYear)
    meeting = Required(Meeting)
    code = Required(UUID, auto=True, unique=True)

    PrimaryKey(group, meeting)
    group_tasks = Set("GroupMeetingTask")


# The tasks to be done by that Group/Meeting combination
class GroupMeetingTask(db.Entity):
    group = Required(GroupMeeting)
    task = Required(Task)

    PrimaryKey(group, task)
    group_files = Optional("GroupMeetingFile")


# The file for a specific task for a specific group/meeting
# Not a part of the groupMeetingTask as the file will be added after the group/meeting/task has been added.
class GroupMeetingFile(db.Entity):
    group_task = PrimaryKey(GroupMeetingTask)
    file_location = Required(str, unique=True)
    date = Required(datetime, default=datetime.utcnow)


# Represents the hosted archive
class ArchiveCode(db.Entity):
    meeting = PrimaryKey(Meeting)
    archive_location = Required(str, unique=True)
    code = Required(UUID, auto=True, unique=True)


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


@db_session
def drop_db():
    db.execute("""
    DROP SCHEMA public CASCADE;
    CREATE SCHEMA public;
    """)


drop_db()
db.generate_mapping(create_tables=True)


# Helper methods

@db_session
def validate_task(task):
    """
    Validates a task
    """
    try:
        # If the task has a code then validate that the tasks group has that code
        # If the task doesn't have a code, validate that the group exists.
        group_name = task["name"]
        if "code" in task:
            code = task["code"]
            if code is not None:
                group_meeting = GroupMeeting.get(lambda group: str(group.code) == code)
                return group_meeting.group.group.name == group_name

        return Group.get(lambda group: group.name == group_name) is not None
    except Exception as e:
        print("Failed validating task " + str(e))
        return False


@db_session
def get_db_tasks(meeting):
    """
    Returns a dictionary from each GroupMeetingTask of the given meeting to a boolean with value False
    """
    try:
        group_tasks = {}
        db_tasks = GroupMeetingTask.select(lambda g_t: g_t.group.meeting == meeting)
        for task in db_tasks:
            group_tasks[task] = False

        return group_tasks
    except Exception as e:
        print("Failed retrieving database tasks " + str(e))
        return {}


class UserError(Exception):
    """
    An error caused by invalid input
    """
    pass


@db_session
def validate_meeting(meeting_json):
    try:
        id = meeting_json["id"]
        date = dateutil.parser.parse(meeting_json["date"])
        last_upload = dateutil.parser.parse(meeting_json["last_upload_date"])
        # Remove any timezone information.
        date = date.replace(tzinfo=None)
        last_upload = last_upload.replace(tzinfo=None)

        lp = meeting_json["lp"]
        if not 0 < lp <= 4:
            raise UserError("invalid lp " + str(lp))
        meeting_no = meeting_json["meeting_no"]
        if not 0 <= meeting_no:
            raise UserError("invalid meeting number " + str(meeting_no))

        if id == "new":
            # The meeting does not exist, we want to create the tasks for it
            meeting = Meeting(year=date.year, date=date, last_upload=last_upload, lp=lp,
                              meeting_no=meeting_no, check_for_deadline=False)
        else:
            meeting = Meeting.get(id=id)
            if meeting is None:
                raise UserError("Meeting id not found and not 'new'")

            meeting.lp = lp
            meeting.meeting_no = meeting_no
            meeting.year = date.year

        tasks = meeting_json["groups_tasks"]
        db_tasks = get_db_tasks(meeting)

        # We want to select all the tasks for this meeting from the database and match the json to it
        for type in tasks:
            for task in tasks[type]:
                if validate_task(task):
                    group_meeting = GroupMeeting.get(
                        lambda group: group.group.group.name == task["name"] and group.meeting == meeting)
                    found = False
                    if group_meeting is None:
                        group = Group[task["name"]]
                        group_meeting = GroupMeeting(group=group, meeting=meeting)
                    else:
                        # The task is valid, check if it has an entry in the db
                        for db_task in db_tasks:
                            if db_task.task.name == type and db_task.group == group_meeting:
                                found = True
                                db_tasks[db_task] = True
                    if not found:
                        # Add a new entry for the task
                        type_task = Task.get(lambda task: task.name == type)
                        GroupMeetingTask(group=group_meeting, task=type_task)

        for task in db_tasks:
            if not db_tasks[task]:
                task.delete()

        meeting.date = date
        meeting.last_upload = last_upload
        return meeting, "ok"
    except UserError as e:
        print("Failed validating meeting due to a user error " + str(e))
        return None, str(e)
    except Exception as e:
        print("Failed validating meeting " + str(e))
        return None, ""
