from datetime import datetime
import json

from pony import orm
from pony.orm import db_session, commit, pony, desc

from db import *


@db_session
def load_general_config():
    with open("config/config.json") as file:
        data = json.load(file)

        # Update all the groups
        for group in data["groups"]:
            # Make sure that if the group already exists, it is updated with any new values!
            if Group.get(name=group["codeName"]) is not None:
                Group[group["codeName"]].delete()
                commit()
            Group(name=group["codeName"], display_name=group["displayName"])

        # Update all the tasks
        for task in data["tasks"]:
            # Make sure that if the task already exists, it is updated with any new values!
            if Task.get(name=task["codeName"]) is not None:
                Task[task["codeName"]].delete()
                commit()
            Task(name=task["codeName"], display_name=task["displayName"])


def compare_lists(list_a, list_b):
    if not len(list_a) == len(list_b):
        return False

    for elem in list_a:
        if elem not in list_b:
            return False

    return True


@db_session
def load_meeting_config():
    with open("config/meeting_config.json") as file:
        data = json.load(file)

        # Update the next meetings data
        date = datetime.strptime(data["date"], "%Y-%m-%dT%H:%M")
        year = date.year
        lp = data["study_period"]
        no = data["meeting_no"]
        if Meeting.get(year=year, lp=lp, meeting_no=no) is not None:
            Meeting[year, lp, no].delete()
            commit()
        meeting = Meeting(year=year, lp=lp, meeting_no=no, date=date)

        all_groups = list(orm.select(group.name for group in Group.select(lambda g: True)))

        # Prepare a list of all tasks for each group
        group_task_dict = {}
        for group in all_groups:
            group_task_dict[group] = []

        # For each group, populate the list
        for tbd in data["tasks_to_be_done"]:
            for group in tbd["groups"]:
                group_task_dict[group].append(tbd["tasks"])

        # Now connect the tasks with the code.
        for group in all_groups:
            code = CodeGroup(group=group, meeting=meeting)
            for task in group_task_dict:
                CodeTasks(code=code, task=task)


@db_session
def generate_codes():
    latest_meeting = Meeting.select(lambda a: True).order_by(desc(Meeting.date)).first()
    print("ASD")

    print("BSD")