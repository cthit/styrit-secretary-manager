import threading
from typing import Dict, List
from uuid import UUID

import pytz

from HttpResponse import HttpResponse, get_with_error, get_with_data
from data_objects.GroupMeetingEmailData import GroupMeetingEmailData
from data_objects.MailData import MailData
from data_objects.StoryData import StoryData
from mail_handler import send_email
from process.ConfigProcess import get_meeting_story_groups
from process.StoryProcess import update_story_group_meetings
from queries.GroupYearQueries import get_story_group_name
from queries.MeetingQueries import get_meeting_ids
from validation.Validation import validate_meeting_id
from queries.ConfigQueries import get_email_config_data
from queries.GroupMeetingTaskQueries import get_story_group_email_datas_for_meeting


def handle_story_email(data: Dict) -> HttpResponse:
    meeting_id_res = validate_meeting_id(data, "id")
    if meeting_id_res.is_error:
        return get_with_error(meeting_id_res.message)
    meeting_id = meeting_id_res.data

    story_datas = update_story_group_meetings(meeting_id)
    threading.Thread(target=send_story_emails, args=(meeting_id, story_datas)).start()
    return get_with_data(get_meeting_story_groups(get_meeting_ids()))


def send_story_emails(meeting_id: UUID, story_datas: List[StoryData]):
    email_datas = get_story_group_email_datas_for_meeting(meeting_id, story_datas)
    for email_data in email_datas:
        mail_data = to_story_email_data(email_data)
        send_email(mail_data)


def to_story_email_data(group: GroupMeetingEmailData) -> MailData:
    email_conf = get_email_config_data()

    # Convert the datetime to the swedish timezone
    last_upload = group.meeting.last_upload.replace(tzinfo=pytz.utc).astimezone(email_conf.timezone)
    last_turnin_time = last_upload.strftime("%H:%M")
    last_turnin_date = last_upload.strftime("%d/%m")

    date = group.meeting.date.replace(tzinfo=pytz.utc).astimezone(email_conf.timezone)
    mail_to = "{0}{1}{2}".format(group.group_name, group.group_year, email_conf.email_domain)

    display_name_year = get_story_group_name(group.group_name, group.group_year)

    msg = email_conf.stories_msg.format(
        group_name_year=display_name_year,
        meeting_day=date.day,
        meeting_month=date.month,
        deadline_time=last_turnin_time,
        deadline_date=last_turnin_date,
        task_list=group.get_formatted_task_list(),
        frontend_url=email_conf.frontend_url,
        group_code=group.group_code,
        template_url=email_conf.document_template_url,
        secretary_email=email_conf.secretary_email,
        board_display_name=email_conf.board_display_name,
        board_email=email_conf.board_email
    )

    subject = email_conf.stories_subject.format(
        meeting_number=group.meeting.meeting_no,
        meeting_lp=group.meeting.lp)
    return MailData(mail_to=mail_to, subject=subject, msg=msg)