
from datetime import datetime
from uuid import UUID

from ResultWithData import ResultWithData, get_result_with_error, get_result_with_data
from data_objects.MeetingJsonData import MeetingJsonData
from db import Meeting


def create_new_meeting(date: datetime, last_upload: datetime, lp: int, meeting_no: int) -> ResultWithData[UUID]:
    try:
        meeting = Meeting(year=datetime.year, date=date, last_upload=last_upload, lp=lp, meeting_no=meeting_no, check_for_deadline=False)
    except Exception as e:
        return get_result_with_error("Failed create meeting")
    return get_result_with_data(meeting.id)


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
