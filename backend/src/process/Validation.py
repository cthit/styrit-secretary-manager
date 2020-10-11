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
from queries.GroupMeetingTaskQueries import get_tasks_for_meeting_bool_dict
from queries.MeetingQueries import get_meeting_by_id


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


def validate_str(json: Dict, key: str) -> ResultWithData[str]:
    if key not in json:
        return get_result_with_error("Missing {0}".format(key))
    return get_result_with_data(json[key])


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


def validate_bool(json: Dict, key: str) -> ResultWithData[bool]:
    if key not in json:
        return get_result_with_error("Missing {0}".format(key))

    bool_str = json[key]
    try:
        val = bool(bool_str)
        return get_result_with_data(val)
    except ValueError:
        get_result_with_error("{0} is not a valid boolean".format(bool_str))


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


def validate_meeting_id(data: Dict, key: str) -> ResultWithData[uuid.UUID]:
    key_res = validate_str(data, key)
    if key_res.is_error:
        return get_result_with_error(key_res.message)

    code_res = validate_code(key_res.data)
    if code_res.is_error:
        return get_result_with_error(code_res.message)

    code = code_res.data
    meeting = get_meeting_by_id(code)
    if meeting is None:
        return get_result_with_error("No meeting exists with id {0}")

    return get_result_with_data(code)