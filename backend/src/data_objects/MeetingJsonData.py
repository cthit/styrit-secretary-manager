import uuid
from dataclasses import dataclass
from datetime import datetime
from typing import List, Optional

from data_objects.GroupTaskData import GroupTaskData


@dataclass
class MeetingJsonData:
    id: Optional[uuid]
    date: datetime
    last_upload: datetime
    lp: int
    meeting_no: int
    groups_tasks: List[GroupTaskData]
