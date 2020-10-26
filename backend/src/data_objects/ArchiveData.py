from dataclasses import dataclass
from uuid import UUID

from data_objects.MeetingData import MeetingData
from queries.ConfigQueries import get_config_value


@dataclass
class ArchiveData:
    code: UUID
    archive_path: str
    meeting: MeetingData

    def get_archive_location(self):
        base_path = get_config_value("archive_base_url")
        return f"{base_path}/{self.code}"
