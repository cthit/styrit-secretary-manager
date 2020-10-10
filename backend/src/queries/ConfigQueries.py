from typing import Optional

from pony import orm
from pony.orm import db_session

from db import Config


@db_session
def get_config_list():
    config_list = []

    # Add general config
    conf = list(orm.select((config.key, config.value, config.config_type.type, config.description) for config in Config))
    for key, value, type, description in conf:
        config_list.append({"key": key, "value": value, "type": type, "description": description})
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
