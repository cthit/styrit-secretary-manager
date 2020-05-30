from pony.orm import commit

from db import *

from src.db import GroupYear, Group, Task, Config, ConfigType


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
        {"key": "archive_base_url", "value": "localhost:5000/api/archive/", "config_type": string},
        {"key": "document_template_url", "value": "https://www.overleaf.com/read/ddjdhxnkxttj", "config_type": string},
        {"key": "gotify_url", "value": "http://gotify:8080/mail", "config_type": string},
        {"key": "secretary_email", "value": "sekreterare@chalmers.it", "config_type": string},
        {"key": "board_email", "value": "styrit@chalmers.it", "config_type": string},
        {"key": "group_email_domain", "value": "@chalmers.it", "config_type": string},
        {"key": "from_email_address", "value": "admin@chalmers.it", "config_type": string},
        {"key": "mail_to_groups_subject", "value": "Dokument till sektionsmöte den {0}/{1}", "config_type": string},
        {"key": "mail_to_groups_message",
         "value": "\nHej {0}!\n\nDen {1}/{2} är det dags för sektionsmöte och senast {3} den {4} behöver ni lämna in "
                  "följande dokument: {5}\nDetta görs på sidan: {6}\nAnge koden: {7}\n\nMall för vissa "
                  "dokument finns här: {8}\nGör en kopia av projektet (Menu -> Copy Project) och fyll i.\n\nOm ni har "
                  "några frågor eller stöter på några problem kan kan ni kontakta mig på {9} eller hela {10} på {11} "
                  ": ).",
         "config_type": long_string},
        {"key": "mail_to_board_subject", "value": "Dokument för sektionsmöte {0} lp {1}", "config_type": string},
        {"key": "mail_to_board_message",
         "value": "\nHej {0}!\n\nDeadlinen för dokumentinsamling till sektionsmöte {1} i lp {2} är nu nådd.\nFör "
                  "nedladdning av dessa dokument klicka på denna länk: {3}\n\nVid frågor, kontakta sekreteraren på {4}",
         "config_type": long_string},
        {"key": "board_display_name", "value": "styrIT", "config_type": string},
        {"key": "minutes_after_deadline_to_mail", "value": "5", "config_type": number},
        {"key": "check_for_deadline_frequency", "value": "5", "config_type": number}
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
            new_group = Group(name=group["codeName"], display_name=group["displayName"])

            if GroupYear.get(group=new_group, year="active") is None:
                GroupYear(group=new_group, year="active", finished=False)

    for task in tasks:
        if Task.get(name=task["codeName"]) is None:
            Task(name=task["codeName"], display_name=task["displayName"])

    commit()
    print("Finished loading database data from general config file.")


def setup_db():
    setup_general_config()
