from datetime import datetime
import json

from pony import orm
from pony.orm import db_session, commit, pony, desc

from db import *


@db_session
def load_general_config():
    with open("config/config.json") as file:
        data = json.load(file)

        for group in data["groups"]:
            if Group.get(name=group["codeName"]) is None:
                Group(name=group["codeName"], display_name=group["displayName"])

        for task in data["tasks"]:
            if Task.get(name=task["codeName"]) is None:
                Task(name=task["codeName"], display_name=task["displayName"])


@db_session
def load_meeting_config():
    with open("config/meeting_config.json") as file:
        data = json.load(file)

        # Update the next meetings data
        date = datetime.strptime(data["date"], "%Y-%m-%dT%H:%M")
        year = date.year
        lp = data["study_period"]
        no = data["meeting_no"]
        meeting = Meeting.get(year=year, lp=lp, meeting_no=no)

        if meeting is None:
            meeting = Meeting(year=year, lp=lp, meeting_no=no, date=date)

        all_groups = list(orm.select(group.name for group in Group.select(lambda g: True)))

        # Prepare a list of all tasks for each group
        group_task_dict = {}
        for group in all_groups:
            group_task_dict[group] = []

        # For each group, populate the list
        for tbd in data["tasks_to_be_done"]:
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
