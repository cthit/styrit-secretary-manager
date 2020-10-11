from typing import Optional
from uuid import UUID

from pony.orm import db_session

from data_objects.MeetingData import MeetingData
from db import Meeting


@db_session
def get_meeting_by_id(id: UUID) -> Optional[Meeting]:
    return Meeting.get(id=id)


@db_session
def get_meeting_for_period(year: int, lp: int, meeting_no: int) -> Optional[Meeting]:
    return Meeting.get(year=year, lp=lp, meeting_no=meeting_no)


@db_session
def get_meeting_data_by_id(id: UUID) -> Optional[MeetingData]:
    meeting = get_meeting_by_id(id)
    if meeting is None:
        return None

    return MeetingData(
        meeting.id,
        meeting.year,
        meeting.date,
        meeting.last_upload,
        meeting.lp,
        meeting.meeting_no
    )