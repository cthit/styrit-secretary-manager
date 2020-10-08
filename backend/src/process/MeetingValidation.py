from typing import Dict, List

from ResultWithData import ResultWithData, get_result_with_error, get_result_with_data
from data_objects.GroupTaskData import GroupTaskData
from data_objects.MeetingJsonData import MeetingJsonData
from process.Validation import validate_date, validate_int, validate_list, validate_dict, \
    validate_code
from queries.GroupMeetingQueries import get_meeting_for_code
from queries.GroupQueries import get_group_by_name
from queries.MeetingQueries import get_meeting_for_period
from queries.TaskQueries import get_task_by_name


def validate_meeting(data: Dict) -> ResultWithData[MeetingJsonData]:
    if "meeting" not in data:
        return get_result_with_error("Missing meeting")

    meeting = data["meeting"]
    if "id" not in meeting:
        return get_result_with_error("Missing id")
    id_str = meeting["id"]

    if id_str != "new":
        code_res = validate_code(id_str)
        if code_res.is_error:
            return get_result_with_error("Invalid meeting id {0}".format(id_str))
        code = code_res.data

        # Validate that the meeting exists
        meeting = get_meeting_for_code(code)
        if meeting is None:
            return get_result_with_error("No meeting with id {0}".format(code))

    general_res = validate_meeting_general(meeting)
    if general_res.is_error:
        return get_result_with_error(general_res.message)
    meeting_data = general_res.data

    groups_tasks_res = validate_groups_tasks(meeting)
    if groups_tasks_res.is_error:
        return get_result_with_error(groups_tasks_res.message)

    meeting_data.groups_tasks = groups_tasks_res.data
    return get_result_with_data(meeting_data)


def validate_meeting_general(meeting: Dict) -> ResultWithData[MeetingJsonData]:
    date_res = validate_date(meeting, "date")
    if date_res.is_error:
        return get_result_with_error(date_res.message)
    date = date_res.data

    last_upload_res = validate_date(meeting, "last_upload")
    if last_upload_res.is_error:
        return get_result_with_error(last_upload_res.message)
    last_upload = last_upload_res.data

    lp_res = validate_int(meeting, "lp")
    if lp_res.is_error:
        return get_result_with_error(lp_res.message)
    lp = lp_res.data

    meeting_no_res = validate_int(meeting, "meeting_no")
    if meeting_no_res.is_error:
        return get_result_with_error(meeting_no_res.message)
    meeting_no = meeting_no_res.data

    if not 0 < lp <= 4:
        return get_result_with_error("Invalid lp {0}".format(lp))

    if not 0 <= meeting_no:
        return get_result_with_error("Invalid meeting number {0}".format(meeting_no))

    same_period_meeting = get_meeting_for_period(date.year, lp, meeting_no)
    if same_period_meeting is not None:
        return get_result_with_error("A meeting already exists for {0}-lp{1}-{2}".format(date.year, lp, meeting_no))

    return get_result_with_data(MeetingJsonData(id=None,
                                                date=date,
                                                last_upload=last_upload,
                                                lp=lp,
                                                meeting_no=meeting_no,
                                                groups_tasks=[]))


def validate_groups_tasks(meeting: Dict) -> ResultWithData[List[GroupTaskData]]:
    groups_tasks_res = validate_dict(meeting, "groups_tasks")
    if groups_tasks_res.is_error:
        return get_result_with_error(groups_tasks_res.message)

    groups_tasks = groups_tasks_res.data

    group_task_datas = []

    for task_type in groups_tasks:
        task = get_task_by_name(task_type)
        if task is None:
            return get_result_with_error("Invalid task {0}".format(task_type))

        task_groups_res = validate_list(groups_tasks, task_type)
        if task_groups_res.is_error:
            return get_result_with_error(task_groups_res.message)
        task_groups = task_groups_res.data

        for group_task in task_groups:
            name = group_task["name"]

            group = get_group_by_name(name)
            if group is None:
                return get_result_with_error("No such group {0}".format(name))

            group_task_datas.append(GroupTaskData(group_name=group.name, task_type=task.name))

    return get_result_with_data(group_task_datas)
