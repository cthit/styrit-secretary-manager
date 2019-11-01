import datetime
import os
import shutil
import time

from pony import orm
from pony.orm import db_session

from config import general_config
import mail_handler
from db import GroupMeetingFile


@db_session
def get_deadline():
    """
    Returns the deadline datetime.
    """
    meeting = mail_handler.get_next_meeting()
    return meeting.last_upload


@db_session
def get_file_paths():
    """
    Returns a list of file_paths for all files uploaded for the latest meeting.
    TODO: the meeting should be given as an input which comes from the frontend!
    """
    meeting = mail_handler.get_next_meeting()

    # Get a list of the filepaths for the meeting
    file_paths = list(orm.select(
        group_file.file_location for group_file in GroupMeetingFile
        if group_file.group_task.group.meeting == meeting
    ))
    return file_paths


def send_final_mail():
    folder_loc = "./b"
    if not os.path.exists(folder_loc):
        os.makedirs(folder_loc)

    file_paths = get_file_paths()

    for path in file_paths:
        print("Path: " + path)
        shutil.copy(path, folder_loc)

    print("Mail styrit through gotify with a zip file containing all the documents")



def check_for_enddate():
    send_final_mail()
    return

    check_time = 5 * 60  # 5 minutes
    min_after_deadline = general_config.minutes_after_deadline_to_mail
    deadline = get_deadline()
    deadline = deadline + datetime.timedelta(minutes=min_after_deadline)
    curr_date = datetime.datetime.now()

    while curr_date < deadline:
        time.sleep(check_time)
        curr_date = datetime.datetime.now()

    send_final_mail()
