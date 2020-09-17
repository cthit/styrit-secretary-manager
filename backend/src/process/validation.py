import json

from pony.orm import db_session

from db import GroupMeeting, Group


@db_session
def validate_task(task: json) -> bool:
    """
    Validates a task
    """
    try:
        # If the task has a code then validate that the tasks group has that code
        # If the task doesn't have a code, validate that the group exists.
        group_name = task["name"]
        if "code" in task:
            code = task["code"]
            if code is not None:
                group_meeting = GroupMeeting.get(lambda group: str(group.code) == code)
                return group_meeting.group.group.name == group_name

        return Group.get(lambda group: group.name == group_name) is not None
    except Exception as e:
        print("Failed validating task " + str(e))
        return False
