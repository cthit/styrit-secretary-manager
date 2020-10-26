from datetime import datetime, timedelta
from time import sleep

from ResultWithData import ResultWithData, get_result_with_error, get_result_with_data
from command.MeetingCommands import update_meeting_check_for_deadline
from data_objects.ArchiveData import ArchiveData
from data_objects.MailData import MailData
from data_objects.MeetingData import MeetingData
from mail_handler import send_email
from process.ArchiveProcess import create_archive
from queries.ArchiveQueries import get_archive_data_by_code
from queries.ConfigQueries import get_config_value_int, get_config_value
from queries.MeetingQueries import get_check_for_deadline_meetings


def check_for_enddate():
    while True:
        curr_date = datetime.utcnow()
        min_after_deadline_to_email_res = get_config_value_int("minutes_after_deadline_to_mail")
        if min_after_deadline_to_email_res.is_error:
            raise Exception(f"Failed to retrieve min after deadline {min_after_deadline_to_email_res.message}")
        check_time = curr_date - timedelta(minutes=min_after_deadline_to_email_res.data)
        meetings = get_check_for_deadline_meetings()

        print(f"Current datetime: {curr_date}, checking for time: {check_time}")
        print(f"Checking for deadline for {len(meetings)} meetings")

        for meeting in meetings:
            deadline = meeting.last_upload
            print(f" - Meeting: {meeting.id} waiting for: {deadline}")
            if deadline <= check_time:
                res = send_board_email(meeting)
                if res.is_error:
                    print(f"Failed sending email to board due to: {res.message}")
                else:
                    print("Successfully sent email to board for meeting")
                update_meeting_check_for_deadline(meeting.id, False)

        check_frequency_res = get_config_value_int("check_for_deadline_frequency")
        if check_frequency_res.is_error:
            raise Exception(f"Failed to retrieve check_frequency {check_frequency_res.message}")
        check_frequency = check_frequency_res.data * 60
        check_frequency = 10
        sleep(check_frequency)


def send_board_email(meeting: MeetingData) -> ResultWithData:
    archive_id_res = create_archive(meeting.id)
    if archive_id_res.is_error:
        return get_result_with_error(archive_id_res.message)

    archive = get_archive_data_by_code(archive_id_res.data)
    print(f"Archive should now be available at '{archive.get_archive_location()}'")

    mail_data = get_board_email_data(meeting, archive)
    send_email(mail_data)
    return get_result_with_data("")


def get_board_email_data(meeting: MeetingData, archive: ArchiveData) -> MailData:
    raw_msg = get_config_value("mail_to_board_message")
    board_name = get_config_value("board_display_name")
    secretary_email = get_config_value("secretary_email")
    msg = raw_msg.format(board_name,
                         meeting.meeting_no,
                         meeting.lp,
                         archive.get_archive_location(),
                         secretary_email)
    to = get_config_value("board_email")

    raw_subject = get_config_value("mail_to_board_subject")
    subject = raw_subject.format(meeting.meeting_no, meeting.lp)

    return MailData(
        mail_to=to,
        subject=subject,
        msg=msg
    )
