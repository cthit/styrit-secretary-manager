from typing import Optional
from uuid import UUID

from pony.orm import db_session

from data_objects.ArchiveData import ArchiveData
from db import ArchiveCode
from queries.MeetingQueries import get_meeting_data_by_id


@db_session
def get_archive_location_by_code(code: UUID) -> Optional[str]:
    archive = ArchiveCode.get(code=code)
    if archive is None:
        return None

    return archive.archive_location


@db_session
def get_archive_data_by_code(code: UUID) -> Optional[ArchiveData]:
    archive = ArchiveCode.get(code=code)
    return archive_to_data(archive)


@db_session
def get_archive_data_by_meeting_id(meeting_id: UUID) -> Optional[ArchiveData]:
    archive = ArchiveCode.get(meeting=meeting_id)
    return archive_to_data(archive)


@db_session
def archive_to_data(archive: Optional[ArchiveCode]) -> Optional[ArchiveData]:
    if archive is None:
        return None

    return ArchiveData(
        archive_path=archive.archive_location,
        meeting=get_meeting_data_by_id(archive.meeting.id),
        code=archive.code
    )
