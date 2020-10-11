from dataclasses import dataclass
from typing import List
from uuid import UUID

from data_objects.MeetingData import MeetingData


@dataclass
class GroupMeetingEmailData:
    meeting: MeetingData
    group_name: str
    group_year: str
    group_display_name: str
    group_code: UUID
    task_names: List[str]

    def get_formatted_task_list(self):
        tasks = "\n"
        for task in self.task_names:
            tasks += " - {0}\n".format(task)

        return tasks
