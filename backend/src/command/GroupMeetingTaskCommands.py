from typing import Optional
from uuid import UUID

from pony.orm import db_session, ConstraintError

from ResultWithData import ResultWithData, get_result_with_data, get_result_with_error
from db import GroupMeetingTask
from queries.GroupMeetingQueries import get_group_meeting
from queries.GroupMeetingTaskQueries import get_group_meeting_task
from queries.TaskQueries import get_task_by_name


@db_session
def create_group_meeting_task(meeting_id: UUID, group_name: str, year: str, task_name: str) -> Optional[GroupMeetingTask]:
    group_meeting_task = get_group_meeting_task(meeting_id, group_name, year, task_name)
    if group_meeting_task is None:
        group = get_group_meeting(meeting_id, group_name, year)
        task = get_task_by_name(task_name)
        group_meeting_task = GroupMeetingTask(group=group, task=task)
    return group_meeting_task


@db_session
def remove_group_meeting_task(meeting_id: UUID, group_name: str, year: str, task_name: str) -> ResultWithData[str]:
    group_meeting_task = get_group_meeting_task(meeting_id, group_name, year, task_name)
    if group_meeting_task is None:
        return get_result_with_data("No group_meeting_task was found for meeting_id: {0}, group: {1}, year: {2}, task_name: {3}".format(meeting_id, group_name, year, task_name))

    try:
        group_meeting_task.delete()
        return get_result_with_data("")
    except ConstraintError:
        if year == "active":
            year_txt = ""
        else:
            year_txt = str(year)
        return get_result_with_error(f"Cannot remove task {task_name} for group {group_name}{year_txt} as there is files already uploaded for it.")
