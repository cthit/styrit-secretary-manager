import uuid
from typing import Dict, List

from HttpResponse import HttpResponse, get_with_error, get_with_data
from ResultWithData import ResultWithData, get_result_with_error, get_result_with_data
from command.GroupMeetingCommands import create_group_meeting
from command.GroupMeetingTaskCommands import create_group_meeting_task, remove_group_meeting_task
from command.MeetingCommands import create_new_meeting, update_meeting
from data_objects.GroupTaskData import GroupTaskData
from data_objects.MeetingJsonData import MeetingJsonData
from process.MeetingValidation import validate_meeting
from queries.GroupMeetingQueries import get_group_meeting
from queries.GroupMeetingTaskQueries import get_group_meeting_task, get_tasks_for_meeting, get_meeting_json_data


def handle_meeting_config(data: Dict) -> HttpResponse:
    try:
        valid = validate_meeting(data)
    except Exception as e:
        print("Failed validating meeting {0}".format(e))
        return get_with_error(400, "Bad Request")

    if valid.is_error:
        return get_with_error(400, valid.message)

    update_res = update_meeting_data(valid.data)
    if update_res.is_error:
        return get_with_error(400, update_res.message)

    meeting_data_res = get_meeting_json_data(valid.data.id)
    if meeting_data_res.is_error:
        return get_with_error(400, meeting_data_res.message)

    return get_with_data(meeting_data_res.data.to_json())


def update_meeting_data(meeting_data: MeetingJsonData) -> ResultWithData[str]:
    if meeting_data.id is None:
        # The meeting does not yet exist, create it.
        create_meeting_res = create_new_meeting(date=meeting_data.date,
                                                last_upload=meeting_data.last_upload,
                                                lp=meeting_data.lp,
                                                meeting_no=meeting_data.meeting_no)
        if create_meeting_res.is_error:
            return get_result_with_error(create_meeting_res.message)

        meeting_data.id = create_meeting_res.data
    else:
        update_res = update_meeting(meeting_data)
        if update_res.is_error:
            return get_result_with_error(update_res.message)

    gt_res = update_groups_tasks(meeting_data.id, meeting_data.groups_tasks)
    if gt_res.is_error:
        return get_result_with_error(gt_res.message)

    return get_result_with_data("")


def update_groups_tasks(meeting_id: uuid, groups_tasks: List[GroupTaskData]) -> ResultWithData[str]:
    # Remove group_tasks
    existing_group_tasks = get_tasks_for_meeting(meeting_id)
    for existing_group_task in existing_group_tasks:
        found = False
        for group_task in groups_tasks:
            if group_task.is_same(existing_group_task):
                found = True
                break

        if not found:
            # Remove the group_task
            remove_group_meeting_task(meeting_id, existing_group_task.group_name, "active",
                                      existing_group_task.task_type)

    # Add new group_tasks
    for group_task in groups_tasks:
        create_group_meeting(meeting_id, group_task.group_name, "active")
        create_group_meeting_task(meeting_id, group_task.group_name, "active", group_task.task_type)

    return get_result_with_data("")
