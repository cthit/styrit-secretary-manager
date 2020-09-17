import uuid

from pony.orm import db_session

from db import Meeting


@db_session
def get_meeting(id: uuid) -> Meeting:
    return Meeting.get(id=id)
