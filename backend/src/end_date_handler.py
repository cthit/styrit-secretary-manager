import datetime
import os
import shutil
import time

from pony import orm
from pony.orm import db_session

from config import general_config
from db import GroupMeetingFile, ArchiveCode


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


def send_final_mail(meeting):
    folder_loc = "./b"
    if not os.path.exists(folder_loc):
        os.makedirs(folder_loc)

    file_paths = get_file_paths(meeting)

    for path in file_paths:
        print("Path: " + path)
        shutil.copy(path, folder_loc)

    archives_loc = "./archives"
    if not os.path.exists(archives_loc):
        os.makedirs(archives_loc)

    archive_name = archives_loc + "/documents_lp" + str(meeting.lp) + "_" + str(meeting.meeting_no) + "_" + str(meeting.year)
    shutil.make_archive(archive_name, 'zip', folder_loc)

    ArchiveCode(meeting=meeting, archive_location=archive_name)

    print("Should mail styrit through gotify and tell them that they can download the archive")
    raise NotImplementedError()


def check_for_enddate(meeting):
    send_final_mail(meeting)
    return


    check_time = 1 # 5 * 60  # 5 minutes
    min_after_deadline = general_config.minutes_after_deadline_to_mail
    deadline = meeting.last_upload
    deadline = deadline + datetime.timedelta(minutes=min_after_deadline)

    curr_date = datetime.datetime.utcnow()

    while curr_date < deadline:
        time.sleep(check_time)
        curr_date = datetime.datetime.utcnow()

    send_final_mail(meeting)
