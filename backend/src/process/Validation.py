import json
import uuid
from datetime import datetime
from typing import Dict, List

import dateutil
from dateutil.parser import parse
from pony.orm import db_session

from ResultWithData import ResultWithData, get_result_with_data, get_result_with_error
from command.GroupMeetingCommands import create_group_meeting
from db import GroupMeeting, Group, Meeting, Task, GroupMeetingTask, GroupYear
from errors.UserError import UserError
from queries.GroupMeetingTaskQueries import get_tasks_for_meeting

# TODO: Apply functional decomposition to this file.

@db_session
def validate_task(task: json) -> bool:
    """
    Validates a task
    """
    try:
        # If the task has a code then validate that the tasks group has that code
        # If the task doesn't have a code, validate that the group exists.
        group_name = task["name"]
        if "code" in task:
            code = task["code"]
            if code is not None:
                group_meeting = GroupMeeting.get(lambda group: str(group.code) == code)
                return group_meeting.group.group.name == group_name

        return Group.get(lambda group: group.name == group_name) is not None
    except Exception as e:
        print("Failed validating task " + str(e))
        return False


@db_session
def validate_meeting(meeting_json):
    try:
        id = meeting_json["id"]
        date = dateutil.parser.parse(meeting_json["date"])
        last_upload = dateutil.parser.parse(meeting_json["last_upload_date"])
        # Remove any timezone information.
        date = date.replace(tzinfo=None)
        last_upload = last_upload.replace(tzinfo=None)

        lp = meeting_json["lp"]
        if not 0 < lp <= 4:
            raise UserError("invalid lp " + str(lp))
        meeting_no = meeting_json["meeting_no"]
        if not 0 <= meeting_no:
            raise UserError("invalid meeting number " + str(meeting_no))

        if id == "new":
            meeting = Meeting.select(lambda m: m.year == date.year and m.lp == lp and m.meeting_no == meeting_no)[:]
            if len(meeting) > 0:
                return None, "A meeting already exists for year {0}, lp {1}, meeting number {2}".format(date.year, lp,
                                                                                                        meeting_no)

            # The meeting does not exist, we want to create the tasks for it
            meeting = Meeting(year=date.year, date=date, last_upload=last_upload, lp=lp,
                              meeting_no=meeting_no, check_for_deadline=False)
        else:
            meeting = Meeting.get(id=id)
            if meeting is None:
                raise UserError("Meeting id not found and not 'new'")

            meeting.lp = lp
            meeting.meeting_no = meeting_no
            meeting.year = date.year

        tasks = meeting_json["groups_tasks"]
        db_tasks = get_tasks_for_meeting(meeting.id)

        # We want to select all the tasks for this meeting from the database and match the json to it
        for type in tasks:
            for task in tasks[type]:
                if validate_task(task):
                    group_meeting = GroupMeeting.get(
                        lambda group: group.group.group.name == task[
                            "name"] and group.meeting == meeting and group.group.year == "active")
                    found = False
                    if group_meeting is None:
                        group_meeting = create_group_meeting(meeting.id, task["name"], "active")
                    else:
                        # The task is valid, check if it has an entry in the db
                        for db_task in db_tasks:
                            if db_task.task.name == type and db_task.group == group_meeting:
                                found = True
                                db_tasks[db_task] = True
                    if not found:
                        # Add a new entry for the task
                        type_task = Task.get(lambda task: task.name == type)
                        GroupMeetingTask(group=group_meeting, task=type_task)

        for task in db_tasks:
            if not db_tasks[task]:
                task.delete()

        meeting.date = date
        meeting.last_upload = last_upload
        return meeting, "ok"
    except UserError as e:
        print("Failed validating meeting due to a user error " + str(e))
        return None, str(e)
    except Exception as e:
        print("Failed validating meeting " + str(e))
        return None, ""


@db_session
def validate_stories(story_groups):
    group_list = []
    try:
        for story_group in story_groups:
            r_group = story_group["group"]
            r_year = int(story_group["year"])
            r_finished = bool(story_group["finished"])

            if Group.get(name=r_group) is not None:
                group_list.append({
                    "group": r_group,
                    "year": r_year,
                    "finished": r_finished
                })
    except TypeError as e:
        msg = "Failed validating storyGroups, invalid format"
        print(msg + ": " + str(e))
        return False, msg
    except Exception as e:
        msg = "Failed validating storyGroups, unknown error"
        print(msg + ": " + str(e))
        return False, msg

    # Add / update the objects in the db.
    for story_group in group_list:
        group = story_group["group"]
        year = str(story_group["year"])
        finished = story_group["finished"]
        group_year = GroupYear.get(group=group, year=year)
        if group_year is None:
            GroupYear(group=group, year=year, finished=finished)
        else:
            group_year.finished = story_group["finished"]

    return True, ""


def validate_code(code: str) -> ResultWithData[uuid.UUID]:
    try:
        return get_result_with_data(uuid.UUID(code))
    except ValueError:
        return get_result_with_error("Invalid code format")


def validate_date(json: Dict, key: str) -> ResultWithData[datetime]:
    if key not in json:
        return get_result_with_error("Missing {0}".format(key))
    date_str = json[key]

    try:
        date = parse(date_str)
        return get_result_with_data(date)
    except ValueError:
        return get_result_with_error("{0} is not a valid date".format(date_str))
    except OverflowError:
        return get_result_with_error("{0} is too large ".format(date_str))


def validate_int(json: Dict, key: str) -> ResultWithData[int]:
    if key not in json:
        return get_result_with_error("Missing {0}".format(key))

    int_str = json[key]
    try:
        val = int(int_str)
        return get_result_with_data(val)
    except ValueError:
        return get_result_with_error("{0} is not a valid integer".format(int_str))


def validate_list(json: Dict, key: str) -> ResultWithData[List]:
    if key not in json:
        return get_result_with_error("Missing {0}".format(key))

    value = json[key]
    if type(value) is not list:
        return get_result_with_error("{0} must be a list".format(key)) 

    return get_result_with_data(value)


def validate_dict(json: Dict, key: str) -> ResultWithData[Dict]:
    if key not in json:
        return get_result_with_error("Missing {0}".format(key))

    value = json[key]
    if type(value) is not dict:
        return get_result_with_error("{0} must be an object".format(key))

    return get_result_with_data(value)
