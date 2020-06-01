from os import environ
from uuid import UUID

import pytz
import requests
from pony import orm
from pony.orm import db_session

from db import GroupMeeting, GroupMeetingTask, Config

from config.config_handler import update_story_group_meetings
from db import GroupYear, Meeting, Group


@db_session
def get_groups_for_meeting(meeting):
    """
    Returns all the GroupMeetings for the meeting
    """
    groups = list(GroupMeeting.select(lambda group_meeting: group_meeting.meeting == meeting))
    return groups


@db_session
def get_tasks_for_group(group: GroupMeeting):
    tasks = ""
    code = group.code
    task_list = list(orm.select(group_meeting_task.task
                                for group_meeting_task in GroupMeetingTask
                                if group_meeting_task.group.code == code))
    for task in task_list:
        tasks += " - " + task.display_name + "\n"

    return tasks


@db_session
def get_group_meeting_email(group_meeting: GroupMeeting):
    """
    Returns the mail to be sent to a group given it's code, group and meeting
    """
    tasks = get_tasks_for_group(group_meeting)
    meeting = group_meeting.meeting
    group = group_meeting.group.group
    code = group_meeting.code

    se_timezone = pytz.timezone(pytz.country_timezones["SE"][0])
    # Convert the datetime to the swedish timezone
    last_upload = meeting.last_upload.replace(tzinfo=pytz.utc).astimezone(se_timezone)
    last_turnin_time = last_upload.strftime("%H:%M")
    last_turnin_date = last_upload.strftime("%d/%m")

    date = meeting.date.replace(tzinfo=pytz.utc).astimezone(se_timezone)
    mail_to = group.name + Config["group_email_domain"].value

    # Setup the message that wil(l be sent to the different groups
    msg = Config["mail_to_groups_message"].value
    frontend_url = Config["frontend_url"].value
    document_template_url = Config["document_template_url"].value
    secretary_email = Config["secretary_email"].value
    board_display_name = Config["board_display_name"].value
    board_email = Config["board_email"].value

    msg = msg.format(group.display_name, date.day, date.month, last_turnin_time, last_turnin_date,
                     tasks, frontend_url, code, document_template_url,
                     secretary_email, board_display_name, board_email)

    raw_subject = Config["mail_to_groups_subject"].value
    subject = raw_subject.format(date.day, date.month)

    return mail_to, subject, msg


@db_session
def send_mails(meeting):
    groups = get_groups_for_meeting(meeting)

    for group_meeting in groups:
        mail_to, subject, msg = get_group_meeting_email(group_meeting)
        send_email(mail_to, subject, msg)


@db_session
def get_story_group_email_address(group : GroupYear):
    domain = Config["group_email_domain"].value
    return group.group.name + group.year[-2:] + domain


@db_session
def get_story_group_name(group_name : str, year: str):
    g = Group.get(name=group_name)
    return g.display_name + year[-2:]


@db_session
def get_meeting_from_id(id : UUID):
    meeting = Meeting.get(id=id)
    if Meeting is None:
        return None, 404
    return meeting, 200


@db_session
def get_story_group_email(group: GroupMeeting):
    meeting = group.meeting
    code = group.code
    tasks = get_tasks_for_group(group)
    name = get_story_group_name(group.group.group.name, group.group.year)

    # Convert the datetime to the swedish timezone
    se_timezone = pytz.timezone(pytz.country_timezones["SE"][0])
    last_upload = meeting.last_upload.replace(tzinfo=pytz.utc).astimezone(se_timezone)
    last_turnin_time = last_upload.strftime("%H:%M")
    last_turnin_date = last_upload.strftime("%d/%m")

    date = meeting.date.replace(tzinfo=pytz.utc).astimezone(se_timezone)

    # Setup the message that wil(l be sent to the different groups
    msg = Config["mail_for_stories"].value
    frontend_url = Config["frontend_url"].value
    document_template_url = Config["document_template_url"].value
    secretary_email = Config["secretary_email"].value
    board_display_name = Config["board_display_name"].value
    board_email = Config["board_email"].value

    msg = msg.format(name, date.day, date.month, last_turnin_time, last_turnin_date,
                     tasks, frontend_url, code, document_template_url,
                     secretary_email, board_display_name, board_email)

    mail_to = get_story_group_email_address(group.group)
    raw_subject = Config["mail_for_stories_subject"].value
    subject = raw_subject.format(date.day, date.month)
    return mail_to, msg, subject



def send_story_emails(meeting_id):
    meeting, code = get_meeting_from_id(meeting_id)
    if code != 200 or meeting is None:
        return {"error": "Meeting with id {0} not found".format(id)}, code

    group_meetings = update_story_group_meetings(meeting)
    for group in group_meetings:
        mail_to, msg, subject = get_story_group_email(group)
        send_email(mail_to, subject, msg)


@db_session
def send_email(mail_to, subject, msg):
    gotify_auth_key = environ.get("gotify_auth_key", "123abc")
    auth = "pre-shared: " + str(gotify_auth_key)
    url = Config["gotify_url"].value
    header = {"Authorization": auth, "Accept": "*/*"}
    mail_from = Config["from_email_address"].value
    data = {"to": mail_to,
            "from": mail_from,
            "subject": subject,
            "body": msg}
    r = None
    try:
        r = requests.post(url=url, json=data, headers=header)
        print("status_code" + str(r.status_code) + "\n" + "reason " + str(r.reason))
    except Exception as e:
        print("Encontered an error while contacting gotify: " + str(e))

