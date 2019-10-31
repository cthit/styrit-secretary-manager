import json

from pony import orm
from pony.orm import db_session, commit

from config import general_config, groups_config, meeting_config
from db import *


@db_session
def setup_general_config():
    '''
    Is used to populate the database if it has been reset.
    :return:
    '''

    long_string = ConfigType.get(type="long_string")
    long_string = ConfigType(type="long_string") if long_string is None else long_string

    string = ConfigType.get(type="string")
    string = ConfigType(type="string") if string is None else string

    number = ConfigType.get(type="number")
    number = ConfigType(type="number") if number is None else number

    config_list = [
        {"key": "frontend_url", "value": "localhost:3000", "config_type": string},
        {"key": "document_template_url", "value": "https://www.overleaf.com/read/ddjdhxnkxttj", "config_type": string},
        {"key": "gotify_url", "value": "http://gotify:8080/mail", "config_type": string},
        {"key": "secretary_email", "value": "sekreterare@chalmers.it", "config_type": string},
        {"key": "board_email", "value": "styrit@chalmers.it", "config_type": string},
        {"key": "group_email_domain", "value": "@chalmers.it", "config_type": string},
        {"key": "from_email_address", "value": "admin@chalmers.it", "config_type": string},
        {"key": "mail_to_groups_message",
         "value": "\nHej {0}!\n\nDen {1}/{2} är det dags för sektionsmöte och senast {3} den {4} behöver ni lämna in följande dokument: {5}\nDetta görs på sidan: {\n6\n}\nAnge koden: {\n7\n}\n\nMall för vissa dokument finns här: {8}\nGör en kopia av projektet (Menu -> Copy Project) och fyll i.\n\nOm ni har några frågor eller stöter på några problem kan kan ni kontakta mig på {9} eller hela {10} på {11} : ).",
         "config_type": long_string},
        {"key": "board_display_name", "value": "styrIT", "config_type": string},
        {"key": "minutes_after_deadline_to_mail", "value": "5", "config_type": number}
    ]

    for config in config_list:
        if Config.get(key=config["key"]) is None:
            Config(key=config["key"], value=config["value"], config_type=config["config_type"])

    # Setup groups and tasks
    groups = [
        {
            "codeName": "armit",
            "displayName": "ArmIT"
        },
        {
            "codeName": "digit",
            "displayName": "digIT"
        },
        {
            "codeName": "fanbarerit",
            "displayName": "FanbärerIT"
        },
        {
            "codeName": "fritid",
            "displayName": "frITid"
        },
        {
            "codeName": "mrcit",
            "displayName": "MRCIT"
        },
        {
            "codeName": "nollkit",
            "displayName": "NollKIT"
        },
        {
            "codeName": "prit",
            "displayName": "P.R.I.T."
        },
        {
            "codeName": "sexit",
            "displayName": "sexIT"
        },
        {
            "codeName": "snit",
            "displayName": "snIT"
        },
        {
            "codeName": "styrit",
            "displayName": "styrIT"
        }
    ]

    tasks = [
        {
            "codeName": "vplan",
            "displayName": "Verksamhetsplan"
        },
        {
            "codeName": "budget",
            "displayName": "Budget"
        },
        {
            "codeName": "vrapport",
            "displayName": "Verksamhetsrapport"
        },
        {
            "codeName": "vberattelse",
            "displayName": "Verksamhetsberättelse"
        },
        {
            "codeName": "eberattelse",
            "displayName": "Ekonomisk Berättelse"
        }
    ]

    for group in groups:
        if Group.get(name=group["codeName"]) is None:
            Group(name=group["codeName"], display_name=group["displayName"])

    for task in tasks:
        if Task.get(name=task["codeName"]) is None:
            Task(name=task["codeName"], display_name=task["displayName"])

    commit()
    print("Finished loading database data from general config file.")


@db_session
def setup_meeting_config():
    # Update the next meetings data
    date = datetime.strptime(meeting_config.date, "%Y-%m-%d %H:%M")
    last_upload_date = datetime.strptime(meeting_config.last_upload_date, "%Y-%m-%d %H:%M")

    year = date.year
    lp = meeting_config.study_period
    no = meeting_config.meeting_no
    meeting = Meeting.get(year=year, lp=lp, meeting_no=no)

    if meeting is None:
        meeting = Meeting(year=year, lp=lp, meeting_no=no, date=date, last_upload=last_upload_date)

    all_groups = list(orm.select(group.name for group in Group.select(lambda g: True)))

    # Prepare a list of all tasks for each group
    group_task_dict = {}
    for group in all_groups:
        group_task_dict[group] = []

    # For each group, populate the list
    for tbd in meeting_config.tasks_to_be_done:
        groups = tbd["groups"]
        if groups == "all":
            groups = all_groups

        for group in groups:
            group_task_dict[group] = group_task_dict[group] + tbd["tasks"]

    # Now connect the tasks with the code.
    for group in all_groups:
        if CodeGroup.get(group=group, meeting=meeting) is None:
            code = CodeGroup(group=group, meeting=meeting)
            for task in group_task_dict[code.group.name]:
                CodeTasks(group=group, meeting=meeting, task=Task[task])

    commit()
    print("Finished loading meeting specific data from file to database")


def setup_db():
    setup_general_config()
    # Below should be done from frontend
    setup_meeting_config()
