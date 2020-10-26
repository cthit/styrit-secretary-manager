from datetime import datetime
from uuid import UUID

from pony.orm import Database, PrimaryKey, Required, Set, Optional, db_session, composite_key

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

    composite_key(year, lp, meeting_no)
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
    description = Required(str)
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
def add_column():
    # DB migration
    db_initiated = db.execute("""
    SELECT EXISTS (
        SELECT FROM information_schema.tables 
        WHERE table_name   = 'config'
    );
   """)

    if not db_initiated.fetchone()[0]:
        # The database is not yet initialized and hence does not contain any data.
        return

    column_exists = db.execute("""
    SELECT 1
    FROM   pg_attribute 
    WHERE  attrelid = 'config'::regclass  -- cast to a registered class (table)
    AND    attname = 'description'
    AND    NOT attisdropped  -- exclude dropped (dead) columns
    """)

    exists = True
    try:
        exists = column_exists.rowcount > 0 and column_exists.fetchone()[0]
    except Exception as e:
        print("ERROR MIGRATING DB: {0}".format(str(e)))

    if not exists:
        print("ADDING COLUMN")
        db.execute("""
        ALTER TABLE config
        ADD COLUMN description text NOT NULL DEFAULT 'none'; 
        """)


add_column()

db.generate_mapping(create_tables=True)
