import uuid
from datetime import datetime
from typing import Optional

from pony.orm import db_session

from data_objects.GroupYearData import GroupYearData
from data_objects.MeetingData import MeetingData
from db import GroupMeeting, Meeting
from queries.GroupYearQueries import get_group_year


@db_session
def get_group_meeting(meeting_id: uuid, group_name: str, year: str) -> Optional[GroupMeeting]:
    group_year = get_group_year(group_name, year)
    return GroupMeeting.get(group=group_year, meeting=meeting_id)


@db_session
def get_group_meeting_by_code(code: uuid) -> Optional[GroupMeeting]:
    return GroupMeeting.get(code=code)


@db_session
def get_last_upload_for_code(code: uuid) -> Optional[datetime]:
    group_meeting = get_group_meeting_by_code(code)
    if group_meeting is None:
        return None

    return group_meeting.meeting.last_upload


@db_session
def get_meeting_for_code(code: uuid) -> Optional[Meeting]:
    group_meeting = get_group_meeting_by_code(code)
    if group_meeting is None:
        return None

    return group_meeting.meeting


@db_session
def get_group_year_data_from_code(code: uuid) -> Optional[GroupYearData]:
    group_meeting = get_group_meeting_by_code(code)

    if group_meeting is None:
        return None

    return GroupYearData(name=group_meeting.group.group.name,
                         display_name=group_meeting.group.group.display_name,
                         year=group_meeting.group.year)


@db_session
def get_meeting_data_from_code(code: uuid) -> Optional[MeetingData]:
    group_meeting = get_group_meeting_by_code(code)

    if group_meeting is None:
        return None

    m = group_meeting.meeting
    return MeetingData(id=m.id,
                       year=m.year,
                       date=m.date,
                       last_upload=m.last_upload,
                       lp=m.lp,
                       meeting_no=m.meeting_no)
