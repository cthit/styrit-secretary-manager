import datetime
import json

import requests
from pony import orm
from pony.orm import db_session, desc

import general_config
import gotify_auth_key
from db import Meeting, CodeGroup, CodeTasks


@db_session
def get_next_meeting():
    return Meeting.select().order_by(desc(Meeting.date)).first()


@db_session
def get_group_codes_for_meeting(meeting):
    code_group_dict = {}
    query = list(CodeGroup.select(lambda code_group: code_group.meeting == meeting))
    for code_group in query:
        code_group_dict[code_group.code] = code_group.group

    return code_group_dict


@db_session
def get_mail_from_code(code, group, meeting):
    tasks = ""
    task_list = list(orm.select(code_task.task for code_task in CodeTasks if code_task.code.code == code))
    for task in task_list:
        tasks += " - " + task.display_name + "\n"

    last_turnin_time = str(meeting.last_upload.hour) + ":" + str(meeting.last_upload.minute)
    last_turnin_date = str(meeting.day) + "/" + str(meeting.month)

    mail_to = group.name + general_config.group_email_domain
    subject = "Dokument till sektionsmöte"
    msg = '''
Hej {0}!
    
Den {1}/{2} är det dags för sektionsmöte och senast {3} den {4} behöver ni lämna in följande dokument: 
{5}
Detta görs på sidan: {6}
Ange koden: {7}

Mall för vissa dokument finns här: {8}
Gör en kopia av projektet (Menu -> Copy Project) och fyll i.

Om ni har några frågor eller stöter på några problem kan kan ni kontakta mig på {9} eller hela {10} på {11} :).
    '''.format(group.display_name, meeting.date.day, meeting.date.month, last_turnin_time, last_turnin_date, tasks, general_config.frontend_url, code, general_config.document_template_url, general_config.my_email, general_config.board_display_name, general_config.board_email)
    return mail_to, subject, msg


@db_session
def send_mails():
    print("\n\n")
    meeting = get_next_meeting()
    group_codes = get_group_codes_for_meeting(meeting)
    print("\n\n")
    for code in group_codes:
        url = general_config.gotify_url
        header = {"Authorization": gotify_auth_key.key, "Accept": "*/*"}
        mail_to, subject, msg = get_mail_from_code(code, group_codes[code], meeting)
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

