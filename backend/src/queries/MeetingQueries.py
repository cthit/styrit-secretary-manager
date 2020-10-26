from typing import Optional, List
from uuid import UUID

from pony.orm import db_session, select

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


@db_session
def get_meeting_ids() -> List[UUID]:
    return list(select(meeting.id for meeting in Meeting))


@db_session
def get_check_for_deadline_meetings() -> List[MeetingData]:
    meeting_datas = []
    meetings = list(Meeting.select(lambda meeting: meeting.check_for_deadline == True))
    for meeting in meetings:
        meeting_datas.append(MeetingData(
            id=meeting.id,
            year=meeting.year,
            date=meeting.date,
            last_upload=meeting.last_upload,
            lp=meeting.lp,
            meeting_no=meeting.meeting_no
        ))
    return meeting_datas
