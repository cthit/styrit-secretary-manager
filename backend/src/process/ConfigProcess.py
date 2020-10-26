from datetime import datetime
from typing import Dict, List

from HttpResponse import HttpResponse, get_with_error, get_with_data
from ResultWithData import ResultWithData, get_result_with_error, get_result_with_data
from command.ConfigCommands import update_config_value
from data_objects.ConfigData import ConfigData
from queries.ConfigQueries import get_config, get_config_list, get_config_value_int
from queries.GroupMeetingTaskQueries import get_meeting_json_data
from queries.GroupQueries import get_groups
from queries.GroupYearQueries import get_group_years
from queries.MeetingQueries import get_meeting_ids
from queries.TaskQueries import get_tasks


def handle_incoming_config(config: Dict) -> HttpResponse:
    validated_configs = validate_configs(config)
    if validated_configs.is_error:
        return get_with_error(400, validated_configs.message)

    configs = validated_configs.data

    for config in configs:
        update_config_value(config.key, config.value)

    return get_with_data({})


def validate_configs(data: Dict) -> ResultWithData[List[ConfigData]]:
    configs = []

    if "config" not in data:
        return get_result_with_error("Missing config array")

    config = data["config"]

    for entry in config:
        if "key" not in entry or "value" not in entry:
            return get_result_with_error("Missing key or value")
        key = entry["key"]
        value = entry["value"]
        db_config = get_config(key)
        if db_config is None:
            return get_result_with_error("Config {0} not found".format(key))

        if db_config.config_type == "number":
            if not value.isdigit():
                return get_result_with_error("Config {0} must be a number, got {1}".format(key, value))

        configs.append(ConfigData(key=key, value=value))

    return get_result_with_data(configs)


def get_configs() -> HttpResponse:
    meetings_res = get_meetings()
    if meetings_res.is_error:
        return get_with_error(500, meetings_res.message)
    meetings = meetings_res.data

    config_list = get_config_list()
    groups = get_groups()
    tasks = get_tasks()

    years_res = get_years()
    if years_res.is_error:
        return get_with_error(500, years_res.message)
    years = years_res.data

    group_years = get_group_years()

    return get_with_data({
        "meetings": meetings,
        "general": config_list,
        "groups": groups,
        "tasks": tasks,
        "years": years,
        "groupYears": group_years
    })


def get_meetings() -> ResultWithData[List[dict]]:
    meetings = []
    meeting_ids = get_meeting_ids()
    for meeting_id in meeting_ids:
        meeting_data_res = get_meeting_json_data(meeting_id)
        if meeting_data_res.is_error:
            return get_result_with_error(meeting_data_res.message)

        meetings.append(meeting_data_res.data.to_json())

    return get_result_with_data(meetings)


def get_years() -> ResultWithData[dict]:
    years = []
    curr_year = datetime.utcnow().year
    years_back_res = get_config_value_int("possible_years_back_for_stories")
    if years_back_res.is_error:
        return get_result_with_error(years_back_res.message)

    for i in range(years_back_res.data):
        years.append(curr_year - i)
    return get_result_with_data(years)
