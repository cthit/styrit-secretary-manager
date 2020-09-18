from typing import Dict, List

from HttpResponse import HttpResponse, get_with_error, get_with_data
from ResultWithData import ResultWithData, get_result_with_error, get_result_with_data
from command.ConfigCommands import update_config_value
from data_objects.ConfigData import ConfigData
from queries.ConfigQueries import get_config


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
