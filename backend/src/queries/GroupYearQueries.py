from typing import List, Dict

from pony.orm import db_session, select

from data_objects.StoryData import StoryData
from db import GroupYear, Group


@db_session
def get_group_year(group: str, year: str) -> GroupYear:
    return GroupYear.get(group=group, year=year)


@db_session
def get_group_years() -> List[Dict]:
    list = []
    group_years = GroupYear.select(lambda gy: gy.finished is False and gy.year != "active")
    for group_year in group_years:
        list.append({
            "group": group_year.group.name,
            "year": int(group_year.year),
            "finished": group_year.finished
        })
    return list


@db_session
def get_story_group_years() -> List[StoryData]:
    story_data_dict = list(select(gy for gy in GroupYear if
                                  gy.year != "active" and
                                  gy.finished is False))
    return [StoryData(
        group=gy.group.name,
        year=gy.year,
        finished=gy.finished
    ) for gy in story_data_dict]
