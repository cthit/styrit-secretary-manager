import datetime
import json

import requests
from pony import orm
from pony.orm import db_session, desc

import gotify_auth_key
from db import Meeting, CodeGroup, CodeTasks


url = ""
with open("config/config.json") as file:
    data = json.load(file)
    url = data["web_page"]


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

    last_day_to_turn_in = meeting.date - datetime.timedelta(days=7)

    mail_to = group.name + "@chalmers.it"
    subject = "Dokument till sektionsmöte"
    msg = '''
Hej {0}!
    
Den {1}/{2} är det dags för sektionsmöte och senast 23:00 den {3}/{4} behöver ni lämna in följande dokument: 
{5}
Detta görs på sidan: {6}
Ange koden: {7}

Mall för vissa dokument finns här: https://www.overleaf.com/read/ddjdhxnkxttj
Gör en kopia av projektet (Menu -> Copy Project) och fyll i.

Om ni har några frågor eller stöter på några problem kan kan ni kontakta mig på sekreterare@chalmers.it eller hela styrIT på styrit@chalmers.it :).


    '''.format(group.display_name, meeting.date.day, meeting.date.month, last_day_to_turn_in.day, last_day_to_turn_in.month, tasks, url, code)
    return mail_to, subject, msg


@db_session
def send_mails():
    print("\n\n")
    meeting = get_next_meeting()
    group_codes = get_group_codes_for_meeting(meeting)
    print("\n\n")
    for code in group_codes:
        url = "http://gotify:8080/mail"
        header = {"Authorization": gotify_auth_key.key, "Accept": "*/*"}
        mail_to, subject, msg = get_mail_from_code(code, group_codes[code], meeting)
        data = {"to": mail_to,
                "from": "admin@chalmers.it",
                "subject": subject,
                "body": msg}
        r = None
        try:
            r = requests.post(url=url, json=data, headers=header)
            print(r.reason)
        except Exception as e:
            print(e)
        except:
            try:
                print("Request failed: " + r.reason)
            except:
                print("Unable to create request")
                pass

