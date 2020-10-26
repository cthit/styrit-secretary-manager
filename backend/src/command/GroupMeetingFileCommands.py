import uuid
from datetime import datetime

from pony.orm import db_session

from db import GroupMeetingFile
from queries.GroupMeetingFileQueries import get_group_meeting_file_from_code
from queries.GroupMeetingTaskQueries import get_group_meeting_task_from_code


@db_session
def create_group_meeting_file(code: uuid, task: str, save_location: str):
    group_task = get_group_meeting_task_from_code(code, task)
    GroupMeetingFile(group_task=group_task, file_location=save_location)


@db_session
def update_upload_date_for_file(code: uuid, task: str, new_date: datetime):
    group_meeting_file = get_group_meeting_file_from_code(code, task)
    group_meeting_file.date = new_date
