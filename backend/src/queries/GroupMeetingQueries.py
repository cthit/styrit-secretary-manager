from datetime import datetime
from typing import Optional
from uuid import UUID

from pony.orm import db_session, select

from data_objects.GroupYearData import GroupYearData
from data_objects.MeetingData import MeetingData
from db import GroupMeeting, Meeting
from queries.GroupYearQueries import get_group_year


@db_session
def get_group_meeting(meeting_id: UUID, group_name: str, year: str) -> Optional[GroupMeeting]:
    group_year = get_group_year(group_name, year)
    return GroupMeeting.get(group=group_year, meeting=meeting_id)


@db_session
def get_group_meeting_by_code(code: UUID) -> Optional[GroupMeeting]:
    return GroupMeeting.get(code=code)


@db_session
def get_last_upload_for_code(code: UUID) -> Optional[datetime]:
    group_meeting = get_group_meeting_by_code(code)
    if group_meeting is None:
        return None

    return group_meeting.meeting.last_upload


@db_session
def get_meeting_for_code(code: UUID) -> Optional[Meeting]:
    group_meeting = get_group_meeting_by_code(code)
    if group_meeting is None:
        return None

    return group_meeting.meeting


@db_session
def get_group_year_data_from_code(code: UUID) -> Optional[GroupYearData]:
    group_meeting = get_group_meeting_by_code(code)

    if group_meeting is None:
        return None

    return GroupYearData(name=group_meeting.group.group.name,
                         display_name=group_meeting.group.group.display_name,
                         year=group_meeting.group.year)


@db_session
def get_meeting_data_from_code(code: UUID) -> Optional[MeetingData]:
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


@db_session
def get_meeting_story_group_data(meeting_id: UUID):
    story_group_meetings = select(group_meeting for group_meeting in GroupMeeting if group_meeting.meeting.id == meeting_id and group_meeting.group.year != "active")
    return [
        {
            "group": group_meeting.group.group.display_name,
            "year": group_meeting.group.year,
            "id": str(group_meeting.code)
        } for group_meeting in story_group_meetings
    ]
