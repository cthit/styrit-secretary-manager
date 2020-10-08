import uuid
from datetime import datetime

from ResultWithData import ResultWithData, get_result_with_error, get_result_with_data
from db import Meeting


def create_new_meeting(date: datetime, last_upload: datetime, lp: int, meeting_no: int) -> ResultWithData[uuid]:
    try:
        meeting = Meeting(year=datetime.year, date=date, last_upload=last_upload, lp=lp, meeting_no=meeting_no, check_for_deadline=False)
    except Exception as e:
        return get_result_with_error("Failed create meeting")
    return get_result_with_data(meeting.id)