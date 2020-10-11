import os
import uuid
from datetime import datetime
from typing import Dict

from HttpResponse import HttpResponse, get_with_error, get_with_data
from ResultWithData import ResultWithData, get_result_with_error, get_result_with_data
from command.GroupMeetingFileCommands import create_group_meeting_file, update_upload_date_for_file
from validation.Validation import validate_code
from queries.ConfigQueries import get_config_value
from queries.GroupMeetingFileQueries import get_group_meeting_file_from_code
from queries.GroupMeetingQueries import get_group_meeting_by_code, get_meeting_data_from_code, \
    get_group_year_data_from_code
from queries.TaskQueries import get_task_by_name


def handle_file_request(code_str: str, files: Dict) -> HttpResponse:
    code_res = validate_code(code_str)
    if code_res.is_error:
        return get_with_error(401, code_res.message)

    code = code_res.data
    group_meeting = get_group_meeting_by_code(code)
    if group_meeting is None:
        secretary_email = get_config_value("secretary_email")
        return get_with_error(404, "Code not found! Please contact the secretary at {0}".format(secretary_email))

    overwrite = False
    for task in files:
        file_res = handle_file(code, task, files[task])
        if file_res.is_error:
            return get_with_error(400, file_res.message)

        overwrite = file_res.data

    return get_with_data({
        "overwrite": overwrite
    })


def handle_file(code: uuid, task: str, file) -> ResultWithData[bool]:
    """
    Saves the file to the disk and stores it's location in the database
    """

    task_obj = get_task_by_name(task)
    if task_obj is None:
        return get_result_with_error("Report type not found {0}".format(task))

    save_location = save_file(code, task, file)
    group_file = get_group_meeting_file_from_code(code, task)
    if group_file is None:
        create_group_meeting_file(code, task, save_location)
        return get_result_with_data(False)

    print("Overwriting file {0} from {1} (GMT)".format(group_file.file_location, group_file.date))
    new_date = datetime.utcnow()
    update_upload_date_for_file(code, task, new_date)
    return get_result_with_data(True)


def save_file(code: uuid, task: str, file) -> str:
    meeting_data = get_meeting_data_from_code(code)
    group_year = get_group_year_data_from_code(code)
    committee = group_year.name
    committee_year = ""
    if group_year.year != "active":
        committee_year = group_year.year

    save_path = "src/uploads/{0}/lp{1}/{2}/{3}".format(meeting_data.year, meeting_data.lp, meeting_data.meeting_no,
                                                       committee)
    name = "{0}_{1}{2}_{3}_{4}.pdf".format(task, committee, committee_year, meeting_data.year, meeting_data.lp)

    if not os.path.exists(save_path):
        os.makedirs(save_path)

    file_name = "{0}/{1}".format(save_path, name)
    print("Saving file {0} in {1}".format(str(file), save_path))
    file.save(file_name)
    return file_name