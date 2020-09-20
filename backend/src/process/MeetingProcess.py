from typing import Dict, List

import dateutil

from HttpResponse import HttpResponse, get_with_error
from ResultWithData import ResultWithData, get_result_with_error, get_result_with_data
from data_objects.GroupTaskData import GroupTaskData
from data_objects.MeetingJsonData import MeetingJsonData
from process.validation import validate_meeting, validate_date, validate_int, validate_list, validate_dict
from queries.TaskQueries import get_task_by_name


def handle_meeting_config(data: Dict) -> HttpResponse:
    try:
        valid = validate_meeting(data)
    except Exception as e:
        print("Failed validating meeting {0}".format(e))
        return get_with_error(400, "Bad Request")

    if valid.is_error:
        return get_with_error(400, valid.message)


def validate_meeting(data: Dict) -> ResultWithData[MeetingJsonData]:
    if "meeting" not in data:
        return get_result_with_error("Missing meeting")

    meeting = data["meeting"]
    if "id" not in meeting:
        return get_result_with_error("Missing id")
    id_str = meeting["id"]

    general_res = validate_meeting_general(meeting)
    if general_res.is_error:
        return general_res
    meeting_data = general_res.data

    if id_str == "new":
        groups_tasks = validate_groups_tasks(meeting, True)


def validate_meeting_general(meeting: Dict) -> ResultWithData[MeetingJsonData]:
    date_res = validate_date(meeting, "date")
    if date_res.is_error:
        return date_res
    date = date_res.data

    last_upload_res = validate_date(meeting, "last_upload")
    if last_upload_res.is_error:
        return last_upload_res
    last_upload = last_upload_res.data

    lp_res = validate_int(meeting, "lp")
    if lp_res.is_error:
        return lp_res
    lp = lp_res.data

    meeting_no_res = validate_int(meeting, "meeting_no")
    if meeting_no_res.is_error:
        return meeting_no_res
    meeting_no = meeting_no_res.data

    if not 0 < lp <= 4:
        return get_with_error("Invalid lp {0}".format(lp))

    if not 0 <= meeting_no:
        return get_with_error("Invalid meeting number {0}".format(meeting_no))

    return get_result_with_data(MeetingJsonData(id=None,
                                                date=date,
                                                last_upload=last_upload,
                                                lp=lp,
                                                meeting_no=meeting_no,
                                                groups_tasks=[]))


def validate_groups_tasks(meeting: Dict, is_new_meeting: bool) -> ResultWithData[List[GroupTaskData]]:
    groups_tasks_res = validate_dict(meeting, "groups_tasks")
    if groups_tasks_res.is_error:
        return get_result_with_error(groups_tasks_res.message)
    groups_tasks = groups_tasks_res.data

    for task_type in groups_tasks:
        task = get_task_by_name(task_type)
        if task is None:
            return get_result_with_error("Invalid task {0}".format(task_type))

        task_groups_res = validate_list(groups_tasks, task_type)
        if task_groups_res.is_error:
            return get_result_with_error(task_groups_res.message)
        task_groups = task_groups_res.data

        for group_task in task_groups:





def handle_incoming_meeting_config(config):
    meeting, msg = validate_meeting(config)
    if meeting is None:
        return 400, {"error": "Invalid meeting format\n " + msg}

    # Probably return the data for the new meeting?
    update_story_group_meetings(meeting)
    return 200, get_config_for_meeting(meeting)
