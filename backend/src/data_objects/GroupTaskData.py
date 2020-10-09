from dataclasses import dataclass
from typing import Optional
from uuid import UUID


@dataclass
class GroupTaskData:
    group_name: str
    code: Optional[UUID]
    task_type: str

    def is_same(self, other) -> bool:
        return self.group_name == other.group_name and self.code == other.code and self.task_type == other.task_type
