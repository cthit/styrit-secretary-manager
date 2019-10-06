import json

from pony import orm
from pony.orm import db_session, commit

from config import general_config, groups_config, meeting_config
from db import *


@db_session
def load_general_config():
    for group in groups_config.groups:
        if Group.get(name=group["codeName"]) is None:
            Group(name=group["codeName"], display_name=group["displayName"])

    for task in groups_config.tasks:
        if Task.get(name=task["codeName"]) is None:
            Task(name=task["codeName"], display_name=task["displayName"])

    commit()
    print("Finished loading database data from general config file.")


@db_session
def load_meeting_config():
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
                CodeTasks(code=code, task=Task[task])

    commit()
    print("Finished loading meeting specific data from file to database")
