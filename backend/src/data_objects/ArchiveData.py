from dataclasses import dataclass
from uuid import UUID

from data_objects.MeetingData import MeetingData


@dataclass
class ArchiveData:
    code: UUID
    archive_path: str
    meeting: MeetingData
