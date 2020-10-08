import uuid

from pony.orm import db_session, Optional

from db import Meeting


@db_session
def get_meeting_by_id(id: uuid) -> Optional[Meeting]:
    return Meeting.get(id=id)


@db_session
def get_meeting_for_period(year: int, lp: int, meeting_no: int) -> Optional[Meeting]:
    return Meeting.get(year=year, lp=lp, meeting_no=meeting_no)