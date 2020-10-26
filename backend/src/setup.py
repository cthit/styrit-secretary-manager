from pony.orm import commit

from db import *
from db import GroupYear, Group, Task, Config, ConfigType


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
        {"key": "frontend_url", "value": "localhost:3000", "config_type": string,
         "description": "The url to this frontend page (used for links in the emails)"},
        {"key": "archive_base_url", "value": "localhost:3000/api/archive/download", "config_type": string,
         "description": "The base url to download archives from (used in emails to the board)"},
        {"key": "document_template_url", "value": "https://www.overleaf.com/read/ddjdhxnkxttj", "config_type": string,
         "description": "The template overleaf document for the different reports (used in the emails)"},
        {"key": "gotify_url", "value": "http://gotify:8080/mail", "config_type": string,
         "description": "The url to the gotify service"},
        {"key": "secretary_email", "value": "sekreterare@chalmers.it", "config_type": string,
         "description": "The email to the secretary"},
        {"key": "board_email", "value": "styrit@chalmers.it", "config_type": string,
         "description": "The email to the board"},
        {"key": "group_email_domain", "value": "@chalmers.it", "config_type": string,
         "description": "The domain to send emails to"},
        {"key": "from_email_address", "value": "admin@chalmers.it", "config_type": string,
         "description": "The email to send from"},
        {"key": "mail_to_groups_subject", "value": "Dokument till sektionsmöte den {0}/{1}", "config_type": string,
         "description": """The subject for "regular" email sendout (that goes out to all active groups that have documents to turn in for the meeting). \n Description of the formatting values: \n - {0} = day of month \n - {1} = number of month"""},
        {"key": "mail_to_groups_message",
         "value": "\nHej {0}!\n\nDen {1}/{2} är det dags för sektionsmöte och senast {3} den {4} behöver ni lämna in "
                  "följande dokument: {5}\nDetta görs på sidan: {6}\nAnge koden: {7}\n\nMall för vissa "
                  "dokument finns här: {8}\nGör en kopia av projektet (Menu -> Copy Project) och fyll i.\n\nOm ni har "
                  "några frågor eller stöter på några problem kan kan ni kontakta mig på {9} eller hela {10} på {11} "
                  ": ).",
         "config_type": long_string, "description":
             """
The body of the "regular" emails (the ones that are sent to all the active groups that should turn in documents for the meeting).  \n
Description of the formatting values:  \n
 - {0} = The display name of the group \n
 - {1} = The day of month for the meeting \n
 - {2} = The month (number) of the meeting \n
 - {3} = The deadline time (hh:mm) \n
 - {4} = The deadline date (dd/mm) \n
 - {5} = A list of the tasks that the group should upload \n
 - {6} = The url to the website \n
 - {7} = Their unique code \n
 - {8} = The document (overleaf) template url \n
 - {9} = The email to the secretary \n
 - {10} = The email to the secretary \n
 - {11} = The display name of the board \n
 - {12} = The email to the board
             """},
        {"key": "mail_to_board_subject", "value": "Dokument för sektionsmöte {0} lp {1}", "config_type": string,
         "description":
             """
 The subject of the email that is sent to the board upon reaching the deadline.  \n
 Description of the formatting values: \n
  - {0} = The number of the meeting that LP (0 if there is just one meeting that LP) \n
  - {1} = The study period of the meeting 
             """},
        {"key": "mail_to_board_message",
         "value": "\nHej {0}!\n\nDeadlinen för dokumentinsamling till sektionsmöte {1} i lp {2} är nu nådd.\nFör "
                  "nedladdning av dessa dokument klicka på denna länk: {3}\n\nVid frågor, kontakta sekreteraren på {4}",
         "config_type": long_string, "description":
             """
The contents of the email that is sent out to the board upon reaching the deadline. \n
Description of the formatting values: \n
 - {0} = The display name of the board \n
 - {1} = The number of the meeting (usually 0) \n
 - {2} = The study period of the meeting \n
 - {3} = A link to the archive download \n
 - {4} = The email to the secretary
             """},
        {"key": "mail_for_stories_subject", "value": "Dokument för sektionsmöte {0} lp {1}", "config_type": string,
         "description":
             """ 
 The subject of the email that is sent to the "story groups" (i.e. the groups that needs to turn in eberattelser / vberattelser.
 Description of the formatting values:
  - {0} = The number of the meeting that study period (usually 0)
  - {1} = The study period
             """},
        {"key": "mail_for_stories",
         "value": "\nHej {0}!\n\nDen {1}/{2} är det dags för sektionsmöte och senast {3} den {4} behöver ni lämna in "
                  "följande dokument: {5}\nDetta görs på sidan: {6}\nAnge koden: {7}\n\nMall för vissa "
                  "dokument finns här: {8}\nGör en kopia av projektet (Menu -> Copy Project) och fyll i.\n "
                  "Kontakta revisorerna på revisorer@chalmers.it för mer information om vad som behövs göras innan ni "
                  "kan bli rekomenderade att bli ansvarsbefriade.\n\nOm ni har "
                  "några frågor eller stöter på några problem kan kan ni kontakta mig på {9} eller hela {10} på {11} "
                  ": ).",
         "config_type": long_string, "description":
             """
The body of the email that is sent to the "story groups" (i.e. the groups that needs to turn in eberattelser / vberattelser) \n
Description of the formatting values: \n
 - {0} = Display name of the group. \n
 - {1} = The day of month that the meeting will take place \n
 - {2} = The month (number) of the meeting \n
 - {3} = The deadline time \n
 - {4} = The deadline date \n
 - {5} = A list of the tasks that the group will have to turn in. \n
 - {6} = A url to the frontend (upload page) \n
 - {7} = Their unique code \n
 - {8} = A link the overleaf template for the documents. \n
 - {9} = The email to the secretary \n
 - {10} = The display name of the board \n
 - {11} = The email to the board 
             """},
        {"key": "board_display_name", "value": "styrIT", "config_type": string,
         "description": "The display name of the board"},
        {"key": "minutes_after_deadline_to_mail", "value": "5", "config_type": number,
         "description": "The amount of minutes to wait extra after the deadline before sending the email to the board"},
        {"key": "check_for_deadline_frequency", "value": "5", "config_type": number,
         "description": "The frequence (in minutes) to check if any deadlines have been reached"},
        {"key": "possible_years_back_for_stories", "value": "5", "config_type": number,
         "description": "The number of years back that one should be able to select story groups for (usually 5 due to tax reasons)"}
    ]

    for config in config_list:
        conf = Config.get(key=config["key"])
        if conf is None:
            Config(key=config["key"], value=config["value"], config_type=config["config_type"],
                   description=config["description"])
        elif conf.description == "none":
            # Used for migration
            conf.description = config["description"]

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
        },
        {
            "codeName": "equalit",
            "displayName": "EqualIT"
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
