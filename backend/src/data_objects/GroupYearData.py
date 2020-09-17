from dataclasses import dataclass


@dataclass
class GroupYearData:
    name: str
    display_name: str
    year: str

    def to_json(self):
        return {
            "codeName": self.name,
            "displayName": self.display_name,
            "year": self.year
        }