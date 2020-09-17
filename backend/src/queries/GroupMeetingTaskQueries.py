import uuid
from typing import Dict

from pony.orm import db_session

from db import GroupMeetingTask


@db_session
def get_db_tasks(meeting: uuid) -> Dict[GroupMeetingTask, bool]:
    """
    Returns a dictionary from each GroupMeetingTask of the given meeting to a boolean with value False
    """
    group_tasks = {}
    db_tasks = GroupMeetingTask.select(lambda g_t: g_t.group.meeting.id == meeting)
    for task in db_tasks:
        group_tasks[task] = False

    return group_tasks
