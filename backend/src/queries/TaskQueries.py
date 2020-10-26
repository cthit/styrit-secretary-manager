from typing import Optional, List

from pony.orm import db_session, select

from db import Task


@db_session
def get_task_by_name(task_name: str) -> Optional[Task]:
    return Task.get(name=task_name)


@db_session
def get_tasks() -> List[dict]:
    tasks = []
    # Filter out the berattelser as they are handled separately
    task_list = list(select((task.name, task.display_name) for task in Task if task.name != "vberattelse" and task.name != "eberattelse"))
    for name, d_name in task_list:
        tasks.append({
            "name": name,
            "display_name": d_name
        })

    return tasks
