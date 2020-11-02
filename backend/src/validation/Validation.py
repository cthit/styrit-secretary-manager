from datetime import datetime
from typing import Dict, List
from uuid import UUID

from dateutil.parser import parse

from ResultWithData import ResultWithData, get_result_with_data, get_result_with_error
from queries.MeetingQueries import get_meeting_by_id


def validate_str(json: Dict, key: str) -> ResultWithData[str]:
    if key not in json:
        return get_result_with_error("Missing {0}".format(key))
    return get_result_with_data(json[key])


def validate_code(code: str) -> ResultWithData[UUID]:
    try:
        return get_result_with_data(UUID(code))
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


def validate_meeting_id(data: Dict, key: str) -> ResultWithData[UUID]:
    key_res = validate_str(data, key)
    if key_res.is_error:
        return get_result_with_error(key_res.message)

    return validate_meeting_id_from_str(key_res.data)


def validate_meeting_id_from_str(id: str) -> ResultWithData[UUID]:
    code_res = validate_code(id)
    if code_res.is_error:
        return get_result_with_error(code_res.message)

    code = code_res.data
    meeting = get_meeting_by_id(code)
    if meeting is None:
        return get_result_with_error("No meeting exists with id {0}")

    return get_result_with_data(meeting.id)
