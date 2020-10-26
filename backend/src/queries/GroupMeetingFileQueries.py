from typing import List
from uuid import UUID

from pony import orm
from pony.orm import db_session

from db import GroupMeetingFile
from queries.GroupMeetingTaskQueries import get_group_meeting_task, get_group_meeting_task_from_code


@db_session
def get_group_meeting_file(group: str, year: str, meeting_id: UUID, task: str) -> GroupMeetingFile:
    group_task = get_group_meeting_task(meeting_id, group, year, task)
    return GroupMeetingFile.get(group_task=group_task)


@db_session
def get_group_meeting_file_from_code(code: UUID, task: str) -> GroupMeetingFile:
    group_task = get_group_meeting_task_from_code(code, task)
    return GroupMeetingFile.get(group_task=group_task)


@db_session
def get_file_paths(id: UUID) -> List[str]:
    """
    Returns a list of file_paths for all files uploaded for the given meeting
    """
    # Get a list of the filepaths for the meeting
    file_paths = list(orm.select(
        group_file.file_location for group_file in GroupMeetingFile
        if group_file.group_task.group.meeting.id == id
    ))
    return file_paths
