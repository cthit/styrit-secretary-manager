from pony.orm import db_session

from db import GroupYear


@db_session
def get_group_year(group: str, year: str) -> GroupYear:
    return GroupYear.get(group=group, year=year)