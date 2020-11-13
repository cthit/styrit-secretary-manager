from datetime import datetime
from typing import Dict, List
from uuid import UUID

from HttpResponse import HttpResponse, get_with_error, get_with_data
from ResultWithData import ResultWithData, get_result_with_error, get_result_with_data
from command.GroupMeetingCommands import create_group_meeting
from command.GroupMeetingTaskCommands import create_group_meeting_task
from command.GroupYearCommands import update_group_year, create_group_year
from data_objects.StoryData import StoryData
from process.ConfigProcess import get_meeting_story_groups
from queries.MeetingQueries import get_meeting_ids
from validation.Validation import validate_list, validate_str, validate_int, validate_bool, validate_meeting_id, \
    validate_meeting_id_from_str
from queries.ConfigQueries import get_config
from queries.GroupYearQueries import get_group_year, get_group_years, get_story_group_years


def handle_stories(config: Dict[str, object]) -> HttpResponse:
    stories_res = validate_stories(config)
    if stories_res.is_error:
        return get_with_error(400, stories_res.message)

    valid = stories_res.data
    update_res = update_stories(valid)
    if update_res.is_error:
        return get_with_error(400, update_res.message)

    return get_with_data({
        "groupYears": get_group_years(),
        "years": get_years()
    })


def validate_stories(config: Dict[str, object]) -> ResultWithData[List[StoryData]]:
    story_groups_res = validate_list(config, "storyGroups")
    if story_groups_res.is_error:
        return get_result_with_error(story_groups_res.message)
    story_groups = story_groups_res.data

    story_groups_list = []

    for sg in story_groups:
        group_res = validate_str(sg, "group")
        if group_res.is_error:
            return get_result_with_error(group_res.message)
        group = group_res.data

        year_res = validate_int(sg, "year")
        if year_res.is_error:
            return get_result_with_error(year_res.message)
        year = year_res.data

        finished_res = validate_bool(sg, "finished")
        if finished_res.is_error:
            return get_result_with_error(finished_res.message)
        finished = finished_res.data

        story_groups_list.append(StoryData(group, str(year), finished))

    return get_result_with_data(story_groups_list)


def update_stories(story_groups: List[StoryData]) -> ResultWithData[str]:
    for story_group in story_groups:
        group_year = get_group_year(story_group.group, story_group.year)
        if group_year is None:
            create_res = create_group_year(story_group.group, story_group.year, story_group.finished)
            if create_res is None:
                return get_result_with_error("Failed to create group year for {0} {1} {2}".format(story_group.group, story_group.year, story_group.finished))
        else:
            update_group_year(story_group.group, story_group.year, story_group.finished)

    return get_result_with_data("")


def get_years():
    years = []
    curr_year = datetime.utcnow().year
    years_back = int(get_config("possible_years_back_for_stories").value)
    for i in range(years_back):
        years.append(curr_year - i)
    return years


def update_story_group_meetings(meeting_id: UUID) -> List[StoryData]:
    story_groups = get_story_group_years()
    for story_group in story_groups:
        create_group_meeting(meeting_id, story_group.group, story_group.year)
        create_group_meeting_task(meeting_id, story_group.group, story_group.year,
                                  "vberattelse")
        create_group_meeting_task(meeting_id, story_group.group, story_group.year,
                                  "eberattelse")
    return story_groups


def connect_stories_to_meeting(id_str: str) -> HttpResponse:
    meeting_id_res = validate_meeting_id_from_str(id_str)
    if meeting_id_res.is_error:
        return get_with_error(400, meeting_id_res.message)
    meeting_id = meeting_id_res.data
    update_story_group_meetings(meeting_id)
    return get_with_data(get_meeting_story_groups(get_meeting_ids()))
