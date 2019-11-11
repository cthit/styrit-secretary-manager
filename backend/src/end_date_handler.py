import datetime
import os
import shutil
import time

import requests
from pony import orm
from pony.orm import db_session

import private_keys
from db import GroupMeetingFile, ArchiveCode, Meeting, Config


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


@db_session
def get_mail(meeting, code):
    msg = Config["mail_to_board_message"].value
    board_email = Config["board_display_name"].value
    link = Config["archive_base_url"].value + str(code)
    secretary_email = Config["secretary_email"].value
    msg = msg.format(board_email, meeting.meeting_no, meeting.lp, link, secretary_email)
    to = Config["board_email"].value
    subject = "Dokument för sektionsmöte {0} lp {1}".format(meeting.meeting_no, meeting.lp)
    return to, subject, msg


@db_session
def send_final_mail(meeting):
    folder_loc = "./b"
    if not os.path.exists(folder_loc):
        os.makedirs(folder_loc)

    file_paths = get_file_paths(meeting)

    for path in file_paths:
        shutil.copy(path, folder_loc)

    archives_loc = "./archives"
    if not os.path.exists(archives_loc):
        os.makedirs(archives_loc)

    archive_name = archives_loc + "/documents_lp" + str(meeting.lp) + "_" + str(meeting.meeting_no) + "_" + str(
        meeting.year)
    shutil.make_archive(archive_name, 'zip', folder_loc)

    # To avoid a transaction error we need to once more get a reference to the meeting
    meeting = Meeting[meeting.year, meeting.lp, meeting.meeting_no]
    archive = ArchiveCode.get(meeting=meeting, archive_location=archive_name)

    url = Config["gotify_url"].value
    header = {"Authorization": private_keys.gotify_auth_key, "Accept": "*/*"}
    mail_to, subject, msg = get_mail(meeting, archive.code)
    data = {"to": mail_to,
            "mail_from": Config["from_email_address"].value,
            "subject": subject,
            "body": msg}
    r = None
    try:
        r = requests.post(url=url, json=data, headers=header)
        print(r.reason)
    except Exception as e:
        print("Encontered an error while contacting gotify: " + str(e))


def check_for_enddate(meeting):
    check_time = int(Config["check_for_deadline_frequency"].value) * 60
    min_after_deadline = int(Config["minutes_after_deadline_to_mail"].value)
    deadline = meeting.last_upload
    deadline = deadline + datetime.timedelta(minutes=min_after_deadline)

    curr_date = datetime.datetime.utcnow()

    while curr_date < deadline:
        time.sleep(check_time)
        curr_date = datetime.datetime.utcnow()

    send_final_mail(meeting)
