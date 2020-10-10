from dataclasses import dataclass


@dataclass
class StoryData:
    group: str
    year: str
    finished: bool
