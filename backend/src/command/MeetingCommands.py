from datetime import datetime
from uuid import UUID

from pony.orm import db_session

from ResultWithData import ResultWithData, get_result_with_error, get_result_with_data
from data_objects.MeetingJsonData import MeetingJsonData
from db import Meeting
from queries.MeetingQueries import get_meeting_by_id


@db_session
def create_new_meeting(date: datetime, last_upload: datetime, lp: int, meeting_no: int) -> ResultWithData[UUID]:
    try:
        meeting = Meeting(year=date.year, date=date, last_upload=last_upload, lp=lp, meeting_no=meeting_no,
                          check_for_deadline=False)
    except Exception as e:
        print("Failed to create meeting due to '{0}'".format(e))
        return get_result_with_error("Failed to create meeting")
    return get_result_with_data(meeting.id)


@db_session
def update_meeting(meeting_data: MeetingJsonData) -> ResultWithData[str]:
    try:
        meeting = Meeting.get(id=meeting_data.id)
        meeting.date = meeting_data.date
        meeting.last_upload = meeting_data.last_upload
        meeting.lp = meeting_data.lp
        meeting.meeting_no = meeting_data.meeting_no
    except Exception as e:
        return get_result_with_error("Failed to update meeting {0}".format(e))

    return get_result_with_data("")


@db_session
def update_meeting_check_for_deadline(meeting_id: UUID, check: bool):
    meeting = get_meeting_by_id(meeting_id)
    meeting.check_for_deadline = check