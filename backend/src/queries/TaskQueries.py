from typing import Optional

from pony.orm import db_session

from db import Task


@db_session
def get_task_by_name(task_name: str) -> Optional[Task]:
    return Task.get(name=task_name)
