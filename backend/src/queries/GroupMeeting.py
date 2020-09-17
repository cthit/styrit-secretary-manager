import uuid

from pony.orm import db_session

from db import GroupMeeting
from queries.GroupYear import get_group_year


@db_session
def get_group_meeting(meeting: uuid, group: str, year: str) -> GroupMeeting:
    group_year = get_group_year(group, year)
    return GroupMeeting.get(meeting=meeting, group_year=group_year)