import uuid
from datetime import datetime
from typing import Dict, Optional

from HttpResponse import HttpResponse, get_with_error, get_with_data
from ResultWithData import ResultWithData, get_result_with_error, get_result_with_data
from process.Validation import validate_code
from queries.ConfigQueries import get_config_value
from queries.GroupMeetingQueries import get_group_meeting_by_code, get_last_upload_for_code, get_meeting_for_code, \
    get_group_year_data_from_code, get_meeting_data_from_code
from queries.GroupMeetingTaskQueries import get_tasks_for_code


def handle_code_request(code_str: str) -> HttpResponse:
    code_res = validate_code(code_str)
    if code_res.is_error:
        return get_with_error(400, code_res.message)

    code_last_upload = get_last_upload_for_code(code_res.data)

    current_date = datetime.utcnow()
    if code_last_upload < current_date:
        secretary_email = get_config_value("secretary_email")
        return get_with_error(401, "Code expired, please contact the secretary at {0}".format(secretary_email))

    data_res = get_data_for_code(code_res.data)
    if data_res.is_error:
        return get_with_error(401, data_res.message)

    return get_with_data({
        "code": code_str,
        "data": data_res.data
    })


def get_data_for_code(code: uuid) -> ResultWithData[Dict]:
    group_meeting = get_group_meeting_by_code(code)

    if group_meeting is None:
        return get_result_with_error("Unable to find meeting for code {0}".format(str(code)))

    tasks = get_tasks_dict_for_code(code)
    meeting = get_meeting_data_from_code(code)
    group_year = get_group_year_data_from_code(code)

    return get_result_with_data({
        "group": group_year.to_json(),
        "study_period": meeting.lp,
        "year": meeting.year,
        "meeting_no": meeting.meeting_no,
        "tasks": tasks
    })


def get_tasks_dict_for_code(code: uuid) -> Dict:
    tasks = get_tasks_for_code(code)

    tasks_json = []
    for task in tasks:
        tasks_json.append({
            "codeName": task.name,
            "displayName": task.display_name
        })
    return tasks_json
