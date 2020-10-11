import threading
from typing import Dict
from uuid import UUID

import pytz

import mail_handler
from HttpResponse import HttpResponse, get_with_error, get_with_data
from data_objects.GroupMeetingEmailData import GroupMeetingEmailData
from data_objects.MailData import MailData
from process.Validation import validate_code, validate_str, validate_meeting_id
from queries.ConfigQueries import get_config_value, get_email_config_data
from queries.GroupMeetingTaskQueries import get_active_group_email_datas_for_meeting
from queries.MeetingQueries import get_meeting_by_id


def handle_email(data: Dict) -> HttpResponse:
    meeting_id_res = validate_meeting_id(data, "id")
    if meeting_id_res.is_error:
        return get_with_error(400, meeting_id_res.message)

    meeting_id = meeting_id_res.data
    threading.Thread(target=send_emails, args=(meeting_id,)).start()
    return get_with_data({})


def send_emails(meeting_id: UUID):
    groups = get_active_group_email_datas_for_meeting(meeting_id)
    for group in groups:
        mail_data = to_email_data(group)
        mail_handler.send_email(mail_data)


def to_email_data(group: GroupMeetingEmailData) -> MailData:
    email_conf = get_email_config_data()

    last_upload = group.meeting.last_upload.replace(tzinfo=pytz.utc).astimezone(email_conf.timezone)
    last_turnin_time = last_upload.strftime("%H:%M")
    last_turnin_date = last_upload.strftime("%d/%m")

    date = group.meeting.date.replace(tzinfo=pytz.utc).astimezone(email_conf.timezone)
    mail_to = "{0}{1}".format(group.group_name, email_conf.email_domain)

    msg = email_conf.active_msg.format(group.group_display_name,
                                       date.day,
                                       date.month,
                                       last_turnin_time,
                                       last_turnin_date,
                                       group.get_formatted_task_list(),
                                       email_conf.frontend_url,
                                       group.group_code,
                                       email_conf.document_template_url,
                                       email_conf.secretary_email,
                                       email_conf.board_display_name,
                                       email_conf.board_email)

    subject = email_conf.active_subject.format(date.day, date.month)

    return MailData(mail_to, subject, msg)
