from datetime import datetime
from uuid import UUID

from pony.orm import Database, PrimaryKey, Required, Set

import db_config as config

db = Database()


class Group(db.Entity):
    name = PrimaryKey(str)
    display_name = Required(str)


class Task(db.Entity):
    name = PrimaryKey(str)
    display_name = Required(str)


class Meeting(db.Entity):
    year = Required(int)
    date = Required(datetime)
    lp = Required(int)
    meeting_no = Required(int)

    PrimaryKey(year, lp, meeting_no)


class CodeGroup(db.Entity):
    code = PrimaryKey(UUID, auto=True)
    group = Required(Group)
    meeting = Required(Meeting)


class CodeTasks(db.Entity):
    code = Required(CodeGroup)
    task = Required(Task)

    PrimaryKey(code , task)



db.bind(
    provider="postgres",
    user=config.POSTGRES_USER,
    password=config.POSTGRES_PASSWORD,
    host=config.POSTGRES_HOST,
    port=config.POSTGRES_PORT,
    database=config.POSTGRES_DB
)

db.generate_mapping(create_tables=True)
