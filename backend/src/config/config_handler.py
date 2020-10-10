from pony import orm
from pony.orm import db_session

from command.GroupMeetingCommands import create_group_meeting
from command.GroupMeetingTaskCommands import create_group_meeting_task
from db import GroupYear
from db import Meeting, Group, Task, GroupMeetingTask, GroupMeeting
from process.StoryProcess import get_years
from process.Validation import validate_stories
from queries.ConfigQueries import get_config_list
from queries.GroupYearQueries import get_group_years


def get_config():
    config = dict()
    config["meetings"] = get_meetings()
    config["general"] = get_config_list()
    config["groups"] = get_groups()
    config["tasks"] = get_tasks()
    config["years"] = get_years()
    config["groupYears"] = get_group_years()
    return config


@db_session
def get_meetings():
    meeting_list = Meeting.select(lambda m: True)
    meeting_jsons = []
    for meeting in meeting_list:
        meeting_jsons.append(get_config_for_meeting(meeting))
    return meeting_jsons


@db_session
def get_config_for_meeting(meeting):
    # Select all codes and tasks
    groups = GroupMeeting.select(lambda group: group.meeting == meeting and group.group.year == "active")
    tasks = {}

    for group_meeting in groups:
        group_tasks = list(GroupMeetingTask.select(lambda g_t: g_t.group == group_meeting))
        for group_task in group_tasks:
            task = group_task.task
            if task.name not in tasks.keys():
                tasks[task.name] = []

            tasks[task.name].append({
                "name": group_meeting.group.group.name,
                "code": str(group_meeting.code)
            })

    m_js = {
        "id": str(meeting.id),
        "lp": meeting.lp,
        "meeting_no": meeting.meeting_no,
        "date": meeting.date.strftime("%Y-%m-%dT%H:%MZ"),
        "last_upload_date": meeting.last_upload.strftime("%Y-%m-%dT%H:%MZ"),
        "groups_tasks": tasks
    }

    return m_js


@db_session
def get_groups():
    groups = []
    group_list = orm.select((group.name, group.display_name) for group in Group)
    for name, d_name in group_list:
        groups.append({
            "name": name,
            "display_name": d_name
        })
    return groups


@db_session
def get_tasks():
    tasks = []
    # We don't want the berattelser as they are handled separately
    task_list = orm.select(
        (task.name, task.display_name) for task in Task if task.name != "vberattelse" and task.name != "eberattelse")
    for name, d_name in task_list:
        tasks.append({
            "name": name,
            "display_name": d_name
        })
    return tasks


@db_session
def get_story_groups():
    return orm.select(gy for gy in GroupYear if gy.year != "active" and gy.finished is False)[:]


@db_session
def update_story_group_meetings(meeting: Meeting):
    """
    Makes sure that all the story groups have meeting ids for the given meeting.
    :param meeting: the meeting to update for.
    :return group_meetings, a list of the GroupMeetings for the given story_groups
    """
    story_groups = get_story_groups()
    group_meetings = []
    for story_group in story_groups:
        group_meeting = create_group_meeting(meeting.id, story_group.group.name, story_group.year)
        create_group_meeting_task(group_meeting.meeting.id, group_meeting.group.group.name, group_meeting.group.year,
                                  "vberattelse")
        create_group_meeting_task(group_meeting.meeting.id, group_meeting.group.group.name, group_meeting.group.year,
                                  "eberattelse")
        group_meetings.append(group_meeting)
    return group_meetings


def handle_incoming_stories_config(config):
    success, msg = validate_stories(config)
    if not success:
        return 400, {"error": "Unable to validate stories\n " + msg}

    group_years = dict()
    group_years["groupYears"] = get_group_years()
    group_years["years"] = get_years()
    return 200, group_years
