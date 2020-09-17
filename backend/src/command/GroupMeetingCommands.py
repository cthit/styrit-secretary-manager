import uuid

from pony.orm import db_session

from db import GroupMeeting
from queries.GroupMeeting import get_group_meeting
from queries.GroupYear import get_group_year


@db_session
def create_group_meeting(meeting_id: uuid, group_name: str, year: str) -> GroupMeeting:
    group = get_group_year(group_name, year)
    group_meeting = get_group_meeting(meeting=meeting_id, group=group_name, year=year)
    if group_meeting is None:
        group_meeting = GroupMeeting(meeting=meeting_id, group=group)
    return group_meeting
