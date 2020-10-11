from typing import Optional

from pony.orm import db_session

from db import Group


@db_session
def get_group_by_name(name: str) -> Optional[Group]:
    return Group.get(name=name)


@db_session
def get_display_name_for_group(name: str) -> Optional[str]:
    group = get_group_by_name(name)
    if group is None:
        return None
    return group.display_name
