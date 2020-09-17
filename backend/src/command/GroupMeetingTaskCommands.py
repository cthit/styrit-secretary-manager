from pony.orm import db_session

from db import GroupMeetingTask
from queries.GroupMeeting import get_group_meeting
from queries.GroupMeetingTaskQueries import get_group_meeting_task
from queries.GroupYear import get_group_year
from queries.TaskQueries import get_task_by_name


@db_session
def create_group_meeting_task(meeting_id, group_name, year, task_name):
    group_meeting_task = get_group_meeting_task(meeting_id, group_name, year, task_name)
    if group_meeting_task is None:
        group = get_group_meeting(meeting_id, group_name, year)
        task = get_task_by_name(task_name)
        group_meeting_task = GroupMeetingTask(group=group, task=task)
    return group_meeting_task
