from typing import Optional

from pony.orm import db_session

from db import GroupYear
from queries.GroupQueries import get_group_by_name
from queries.GroupYearQueries import get_group_year


@db_session
def update_group_year(group: str, year: str, finished: bool):
    group_year = get_group_year(group, year)
    group_year.finished = finished


@db_session
def create_group_year(group_name: str, year: str, finished: bool) -> Optional[GroupYear]:
    group = get_group_by_name(group_name)
    if group is None:
        return None
    return GroupYear(group=group, year=year, finished=finished)