from pony import orm
from pony.orm import db_session

from db import GroupMeetingFile


@db_session
def get_file_paths(meeting):
    """
    Returns a list of file_paths for all files uploaded for the given meeting
    """
    # Get a list of the filepaths for the meeting
    file_paths = list(orm.select(
        group_file.file_location for group_file in GroupMeetingFile
        if group_file.group_task.group.meeting == meeting
    ))
    return file_paths
