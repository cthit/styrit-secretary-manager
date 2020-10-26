import datetime
import os
import shutil
import time

import requests
from pony import orm
from pony.orm import db_session

from command.MeetingCommands import update_meeting_check_for_deadline
from db import GroupMeetingFile, ArchiveCode, Meeting, Config
from queries.ConfigQueries import get_config_value
from queries.GroupMeetingFileQueries import get_file_paths


def get_mail(meeting, code):
    msg = get_config_value("mail_to_board_message")
    board_name = get_config_value("board_display_name")
    link = get_config_value("archive_base_url") + str(code)
    secretary_email = get_config_value("secretary_email")
    msg = msg.format(board_name, meeting.meeting_no, meeting.lp, link, secretary_email)
    to = get_config_value("board_email")
    raw_subject = get_config_value("mail_to_board_subject")
    subject = raw_subject.format(meeting.meeting_no, meeting.lp)

    return to, subject, msg


@db_session
def create_archive(meeting):
    folder_loc = "src/b"

    if os.path.exists(folder_loc):
        # Delete any old files.
        shutil.rmtree(folder_loc)

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

    archive_name = archive_name[4:]
    archive = ArchiveCode.get(meeting=meeting)
    if archive is None:
        # Create a new archive
        archive = ArchiveCode(meeting=meeting, archive_location=archive_name)
    else:
        archive.archive_location = archive_name

    return archive


@db_session
def send_final_mail(meeting):
    archive = create_archive(meeting)

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
    while True:
        # These are in the while-loop as they could've been updated in the database
        check_time, min_after_deadline = get_enddate_configs()
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
                update_meeting_check_for_deadline(meeting.id, False)

        time.sleep(check_time)


@db_session
def get_enddate_configs():
    return int(Config["check_for_deadline_frequency"].value) * 60, \
           int(Config["minutes_after_deadline_to_mail"].value)


@db_session
def get_meetings_to_check():
    return list(Meeting.select(lambda meeting: meeting.check_for_deadline == True))