import uuid
from dataclasses import dataclass
from typing import Optional


@dataclass
class GroupTaskData:
    group_name: str
    code: Optional[uuid]
    task_type: str
