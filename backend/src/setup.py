from datetime import datetime
import json

from pony import orm
from pony.orm import db_session, commit, pony, desc

from db import Group, Task, Meeting, GroupsTasksName, GroupsTasksTask, GroupsTasksGroup, MeetingTasks


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

        # Generate the meetings groups/tasks (GroupMeeting)
        for tbd in data["tasks_to_be_done"]:
            name = tbd["name"]
            if GroupsTasksName.get(name=name) is not None:
                GroupsTasksTask.select(lambda p: p.name.name == name).delete(bulk=True)
                GroupsTasksGroup.select(lambda p: p.name.name == name).delete(bulk=True)
                GroupsTasksName.get(name=name).delete()
                commit()

            gt_name = GroupsTasksName(name=name)
            MeetingTasks(meeting=meeting, task=gt_name)

            for task in tbd["tasks"]:
                GroupsTasksTask(name=gt_name, task=task)

            groups_to_use = tbd["groups"]
            if groups_to_use == "all":
                groups_to_use = all_groups
            for group in groups_to_use:
                GroupsTasksGroup(name=gt_name, group=group)


@db_session
def generate_codes():
    latest_meeting = Meeting.select(lambda a: True).order_by(desc(Meeting.date)).first()
    print("ASD")

    print("BSD")