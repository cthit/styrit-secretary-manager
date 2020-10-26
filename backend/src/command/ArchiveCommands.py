from typing import Optional
from uuid import UUID

from pony.orm import db_session

from data_objects.ArchiveData import ArchiveData
from db import ArchiveCode
from queries.ArchiveQueries import archive_to_data


@db_session
def create_archive_code(meeting_id: UUID, archive_location: str) -> Optional[ArchiveData]:
    archive = ArchiveCode(meeting=meeting_id, archive_location=archive_location)
    return archive_to_data(archive)


@db_session
def update_archive_location(archive_code: UUID, new_location: str) -> Optional[ArchiveData]:
    archive = ArchiveCode.get(code=archive_code)
    archive.archive_location = new_location
    return archive_to_data(archive)
