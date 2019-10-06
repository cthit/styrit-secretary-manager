import datetime
import os
import shutil
import time

from pony import orm
from pony.orm import db_session

from config import general_config
import mail_handler
from db import CodeGroup, CodeFile


@db_session
def get_deadline():
    meeting = mail_handler.get_next_meeting()
    return meeting.last_upload


@db_session
def get_file_paths():
    meeting = mail_handler.get_next_meeting()
    codes = list(orm.select(code_group.code for code_group in CodeGroup if code_group.meeting == meeting))
    return list(orm.select(code_file.file_location for code_file in CodeFile if code_file.code.code in codes))


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
