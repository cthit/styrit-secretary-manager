from pony.orm import db_session

from queries.ConfigQueries import get_config


@db_session
def update_config_value(key: str, new_value: str):
    config = get_config(key)
    config.value = new_value
