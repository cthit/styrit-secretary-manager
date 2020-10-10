from pony.orm import db_session

from db import GroupYear


@db_session
def get_group_year(group: str, year: str) -> GroupYear:
    return GroupYear.get(group=group, year=year)


@db_session
def get_group_years():
    list = []
    group_years = GroupYear.select(lambda gy: gy.finished is False and gy.year != "active")
    for group_year in group_years:
        list.append({
            "group": group_year.group.name,
            "year": int(group_year.year),
            "finished": group_year.finished
        })
    return list