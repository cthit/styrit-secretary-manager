from typing import Optional, List

from pony import orm
from pony.orm import db_session

from ResultWithData import ResultWithData, get_result_with_data, get_result_with_error
from data_objects.EmailConfigData import EmailConfigData
from db import Config


@db_session
def get_config_list() -> List[dict]:
    config_list = []

    # Add general config
    conf = list(
        orm.select((config.key, config.value, config.config_type.type, config.description) for config in Config))
    for key, value, type, description in conf:
        config_list.append({
            "key": key,
            "value": value,
            "type": type,
            "description": description
        })
    return config_list


@db_session
def get_config(key: str) -> Optional[Config]:
    return Config.get(key=key)


@db_session
def get_config_value(config_key: str) -> str:
    config = Config.get(key=config_key)
    if config is None:
        raise Exception("No config found with key {0}".format(config_key))
    return config.value


def get_config_value_int(config_key: str) -> ResultWithData[int]:
    value = get_config_value(config_key)
    try:
        return get_result_with_data(int(value))
    except ValueError:
        return get_result_with_error(f"Config value {value} for key {config_key} is not a valid integer")


@db_session
def get_email_config_data() -> EmailConfigData:
    return EmailConfigData(
        active_msg=get_config_value("mail_to_groups_message"),
        stories_msg=get_config_value("mail_for_stories"),
        active_subject=get_config_value("mail_to_groups_subject"),
        stories_subject=get_config_value("mail_for_stories_subject"),
        frontend_url=get_config_value("frontend_url"),
        document_template_url=get_config_value("document_template_url"),
        secretary_email=get_config_value("secretary_email"),
        board_display_name=get_config_value("board_display_name"),
        board_email=get_config_value("board_email"),
        email_domain=get_config_value("group_email_domain")
    )
