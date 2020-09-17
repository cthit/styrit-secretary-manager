import uuid
from dataclasses import dataclass
from datetime import datetime


@dataclass
class MeetingData:
    id: uuid
    year: int
    date: datetime
    last_upload: datetime
    lp: int
    meeting_no: int
