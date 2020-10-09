from dataclasses import dataclass
from datetime import datetime
from typing import List, Optional
from uuid import UUID

from data_objects.GroupTaskData import GroupTaskData


@dataclass
class MeetingJsonData:
    id: Optional[UUID]
    date: datetime
    last_upload: datetime
    lp: int
    meeting_no: int
    groups_tasks: List[GroupTaskData]

    def to_json(self):
        gt_dict = {}
        for gt in self.groups_tasks:
            if gt.task_type not in gt_dict:
                gt_dict[gt.task_type] = []
            gt_dict[gt.task_type].append({
                "name": gt.group_name,
                "code": str(gt.code)
            })

        return {
            "id": str(self.id),
            "lp": self.lp,
            "meeting_no": self.meeting_no,
            "date": self.date.strftime("%Y-%m-%dT%H:%MZ"),
            "last_upload_date": self.last_upload.strftime("%Y-%m-%dT%H:%MZ"),
            "groups_tasks": gt_dict
        }
