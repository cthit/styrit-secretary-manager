import threading
from typing import Dict
from uuid import UUID

import pytz

import mail_handler
from HttpResponse import HttpResponse, get_with_error, get_with_data
from data_objects.GroupMeetingEmailData import GroupMeetingEmailData
from data_objects.MailData import MailData
from process.Validation import validate_code, validate_str
from queries.ConfigQueries import get_config_value
from queries.GroupMeetingTaskQueries import get_active_groups_for_meeting
from queries.MeetingQueries import get_meeting_by_id


def handle_email(data: Dict) -> HttpResponse:
    id_str_res = validate_str(data, "id")
    if id_str_res.is_error:
        return get_with_error(400, id_str_res.message)

    id_res = validate_code(id_str_res.data)
    if id_res.is_error:
        return get_with_error(400, id_res.message)
    id = id_res.data

    meeting = get_meeting_by_id(id)
    if meeting is None:
        return get_with_error(400, "No meeting with id {0}".format(id))

    threading.Thread(target=send_emails, args=(meeting.id,)).start()
    return get_with_data({})


def send_emails(meeting_id: UUID):
    groups = get_active_groups_for_meeting(meeting_id)
    for group in groups:
        mail_data = to_email_data(group)
        mail_handler.send_email(mail_data)


def to_email_data(group: GroupMeetingEmailData) -> MailData:
    se_timezone = pytz.timezone(pytz.country_timezones["SE"][0])
    last_upload = group.meeting.last_upload.replace(tzinfo=pytz.utc).astimezone(se_timezone)
    last_turnin_time = last_upload.strftime("%H:%M")
    last_turnin_date = last_upload.strftime("%d/%m")

    date = group.meeting.date.replace(tzinfo=pytz.utc).astimezone(se_timezone)
    mail_to = "{0}{1}".format(group.group_name, get_config_value("group_email_domain"))

    raw_msg = get_config_value("mail_to_groups_message")
    frontend_url = get_config_value("frontend_url")
    document_template_url = get_config_value("document_template_url")
    secretary_email = get_config_value("secretary_email")
    board_display_name = get_config_value("board_display_name")
    board_email = get_config_value("board_email")

    msg = raw_msg.format(group.group_display_name, date.day,
                     date.month, last_turnin_time, last_turnin_date,
                     group.get_formatted_task_list(),
                     frontend_url, group.group_code, document_template_url,
                     secretary_email, board_display_name, board_email)

    raw_subject = get_config_value("mail_to_groups_subject")
    subject = raw_subject.format(date.day, date.month)

    return MailData(mail_to, subject, msg)