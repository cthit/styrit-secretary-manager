import uuid
from typing import Dict, List

from pony.orm import db_session, select

from db import GroupMeetingTask, Task
from queries.GroupMeetingQueries import get_group_meeting, get_group_meeting_by_code
from queries.TaskQueries import get_task_by_name


@db_session
def get_group_meeting_task(meeting_id: uuid, group_name: str, year: str, task_name: str) -> GroupMeetingTask:
    task = get_task_by_name(task_name)
    group = get_group_meeting(meeting_id, group_name, year)
    return GroupMeetingTask.get(group=group, task=task)


@db_session
def get_group_meeting_task_from_code(code: uuid, task: str) -> GroupMeetingTask:
    group_meeting = get_group_meeting_by_code(code)
    return GroupMeetingTask.get(group=group_meeting, task=task)


@db_session
def get_tasks_for_meeting(meeting_id: uuid) -> Dict[GroupMeetingTask, bool]:
    """
    Returns a dictionary from each GroupMeetingTask of the given meeting to a boolean with value False
    """
    group_tasks = {}
    db_tasks = GroupMeetingTask.select(lambda g_t: g_t.group.meeting.id == meeting_id)
    for task in db_tasks:
        group_tasks[task] = False

    return group_tasks


@db_session
def get_tasks_for_code(code: uuid) -> List[Task]:
    return select(gmt.task for gmt in GroupMeetingTask if gmt.group.code == code)[:]
