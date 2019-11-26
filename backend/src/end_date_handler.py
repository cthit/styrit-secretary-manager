import datetime
import os
import shutil
import time

import requests
from pony import orm
from pony.orm import db_session

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
    folder_loc = "src/b"
    if not os.path.exists(folder_loc):
        os.makedirs(folder_loc)

    file_paths = get_file_paths(meeting)

    for path in file_paths:
        shutil.copy(path, folder_loc)

    archives_loc = "src/archives"
    if not os.path.exists(archives_loc):
        os.makedirs(archives_loc)

    archive_name = archives_loc + "/documents_lp" + str(meeting.lp) + "_" + str(meeting.meeting_no) + "_" + str(
        meeting.year)
    print("Archiving folder: " + str(folder_loc) + "\nTo file: " + str(archive_name))
    shutil.make_archive(archive_name, 'zip', folder_loc)

    # To avoid a transaction error we need to once more get a reference to the meeting
    id = meeting.id
    meeting = Meeting.get(id=id)
    if meeting is None:
        raise Exception("Unable to find meeting with id " + str(id))

    # Set the flag for checking the deadline to false to avoid multiple emails.
    meeting.check_for_deadline = False

    archive = ArchiveCode.get(meeting=meeting, archive_location=archive_name)
    if archive is None:
        # Create a new archive
        archive = ArchiveCode(meeting=meeting, archive_location=archive_name)

    print("Archive should now be available at '" + str(Config["archive_base_url"].value) + str(archive.code) + "'")

    url = Config["gotify_url"].value
    gotify_auth_key = os.environ.get("gotify_auth_key", "123abc")
    header = {"Authorization": "pre-shared: " + str(gotify_auth_key), "Accept": "*/*"}
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


def check_for_enddate():
    check_time, min_after_deadline = get_enddate_configs()

    while True:
        curr_date = datetime.datetime.utcnow()
        meetings = get_meetings_to_check()
        print("Checking for deadlines for " + str(len(meetings)) + " meetings")
        print("Curr time: " + str(curr_date))
        for meeting in meetings:
            deadline = meeting.last_upload
            deadline = deadline + datetime.timedelta(minutes=min_after_deadline)
            print("Meeting: " + str(meeting.id) + " waiting for: " + str(deadline))
            if deadline <= curr_date:
                send_final_mail(meeting)

        time.sleep(check_time)


@db_session
def get_enddate_configs():
    return int(Config["check_for_deadline_frequency"].value) * 60, \
           int(Config["minutes_after_deadline_to_mail"].value)


@db_session
def get_meetings_to_check():
    return list(Meeting.select(lambda meeting: meeting.check_for_deadline == True))