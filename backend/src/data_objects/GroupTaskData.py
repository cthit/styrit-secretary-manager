from dataclasses import dataclass
from typing import Optional
from uuid import UUID


@dataclass
class GroupTaskData:
    group_name: str
    code: Optional[UUID]
    task_type: str
