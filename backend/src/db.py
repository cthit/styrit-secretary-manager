from datetime import datetime
from uuid import UUID

from pony.orm import Database, PrimaryKey, Required, Set, composite_key

import db_config as config

db = Database()


class Group(db.Entity):
    name = PrimaryKey(str)
    display_name = Required(str)
    code_groups = Set("CodeGroup")


class Task(db.Entity):
    name = PrimaryKey(str)
    display_name = Required(str)

    code_tasks = Set("CodeTasks")
    code_files = Set("CodeFile")


class Meeting(db.Entity):
    year = Required(int)
    date = Required(datetime)
    last_upload = Required(datetime)
    lp = Required(int)
    meeting_no = Required(int)
    code_groups = Set("CodeGroup")

    PrimaryKey(year, lp, meeting_no)


class CodeGroup(db.Entity):
    code = PrimaryKey(UUID, auto=True)
    group = Required(Group)
    meeting = Required(Meeting)

    code_tasks = Set("CodeTasks")
    code_files = Set("CodeFile")
    composite_key(group, meeting)


class CodeTasks(db.Entity):
    code = Required(CodeGroup)
    task = Required(Task)

    PrimaryKey(code, task)


class CodeFile(db.Entity):
    code = Required(CodeGroup)
    task = Required(Task)
    file_location = Required(str, unique=True)
    date = Required(datetime, auto=True)

    PrimaryKey(code, task)


db.bind(
    provider="postgres",
    user=config.POSTGRES_USER,
    password=config.POSTGRES_PASSWORD,
    host=config.POSTGRES_HOST,
    port=config.POSTGRES_PORT,
    database=config.POSTGRES_DB
)

db.generate_mapping(create_tables=True)
