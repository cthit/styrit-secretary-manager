from pony.orm import db_session

from db import Group


@db_session
def get_group_by_name(name: str) -> Group:
    return Group.get(name=name)
