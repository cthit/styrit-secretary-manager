import requests
from pony import orm
from pony.orm import db_session, desc

from config import general_config
import private_keys
from db import Meeting, GroupMeeting, GroupMeetingTask


@db_session
def get_next_meeting():
    return Meeting.select().order_by(desc(Meeting.date)).first()


@db_session
def get_groups_for_meeting(meeting):
    """
    Returns all the GroupMeetings for the meeting
    """
    groups = list(GroupMeeting.select(lambda group_meeting: group_meeting.meeting == meeting))
    return groups


@db_session
def get_mail_from_code(code, group, meeting):
    """
    Returns the mail to be sent to a group given it's code, group and meeting
    """
    tasks = ""
    task_list = list(orm.select(group_meeting_task.task
                                for group_meeting_task in GroupMeetingTask
                                if group_meeting_task.group.code == code))
    for task in task_list:
        tasks += " - " + task.display_name + "\n"

    last_turnin_time = meeting.last_upload.strftime("%H:%M")
    last_turnin_date = meeting.last_upload.strftime("%d/%m")

    mail_to = group.name + general_config.group_email_domain
    subject = "Dokument till sektionsmöte"

    # Setup the message that will be sent to the different groups
    msg = general_config.mail_to_groups_message.format(group.display_name, meeting.date.day, meeting.date.month, last_turnin_time, last_turnin_date, tasks, general_config.frontend_url, code, general_config.document_template_url, general_config.my_email, general_config.board_display_name, general_config.board_email)
    return mail_to, subject, msg


@db_session
def send_mails():
    print("\n\n")
    meeting = get_next_meeting()
    groups = get_groups_for_meeting(meeting)
    print("\n\n")
    for group_meeting in groups:
        url = general_config.gotify_url
        header = {"Authorization": private_keys.gotify_auth_key, "Accept": "*/*"}
        mail_to, subject, msg = get_mail_from_code(group_meeting.code, group_meeting.group, meeting)
        data = {"to": mail_to,
                "from": general_config.from_email_address,
                "subject": subject,
                "body": msg}
        r = None
        try:
            r = requests.post(url=url, json=data, headers=header)
            print(r.reason)
        except Exception as e:
            print("Encontered an error while contacting gotify: " + str(e))

