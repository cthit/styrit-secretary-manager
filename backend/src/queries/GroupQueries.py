from typing import Optional, List

from pony.orm import db_session, select

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


@db_session
def get_groups() -> List[dict]:
    groups = []
    group_list = list(select((group.name, group.display_name) for group in Group))
    for name, d_name in group_list:
        groups.append({
            "name": name,
            "display_name": d_name
        })

    return groups