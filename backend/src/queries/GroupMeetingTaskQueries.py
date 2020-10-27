from typing import Dict, List, Optional
from uuid import UUID

from pony.orm import db_session, select

from ResultWithData import ResultWithData, get_result_with_error, get_result_with_data
from data_objects.GroupMeetingEmailData import GroupMeetingEmailData
from data_objects.GroupTaskData import GroupTaskData
from data_objects.MeetingData import MeetingData
from data_objects.MeetingJsonData import MeetingJsonData
from data_objects.StoryData import StoryData
from db import GroupMeetingTask, Task, GroupMeeting
from queries.GroupMeetingQueries import get_group_meeting, get_group_meeting_by_code
from queries.GroupQueries import get_display_name_for_group
from queries.MeetingQueries import get_meeting_by_id, get_meeting_data_by_id
from queries.TaskQueries import get_task_by_name


@db_session
def get_group_meeting_task(meeting_id: UUID, group_name: str, year: str, task_name: str) -> Optional[GroupMeetingTask]:
    task = get_task_by_name(task_name)
    group = get_group_meeting(meeting_id, group_name, year)
    return GroupMeetingTask.get(group=group, task=task)


@db_session
def get_group_meeting_task_from_code(code: UUID, task: str) -> GroupMeetingTask:
    group_meeting = get_group_meeting_by_code(code)
    return GroupMeetingTask.get(group=group_meeting, task=task)


@db_session
def get_tasks_for_meeting(meeting_id: UUID) -> List[GroupTaskData]:
    group_tasks = GroupMeetingTask.select(lambda g_t: g_t.group.meeting.id == meeting_id)[:]
    group_task_datas = []
    for group_task in group_tasks:
        if group_task.task.name != "vberattelse" and group_task.task.name != "eberattelse":
            group_task_datas.append(
                GroupTaskData(group_task.group.group.group.name, group_task.group.code, group_task.task.name))

    return group_task_datas


@db_session
def get_tasks_for_group_meeting(group_meeting: GroupMeeting) -> List[str]:
    return list(select(gmt.task.name for gmt in GroupMeetingTask if
                       gmt.group == group_meeting))


@db_session
def get_tasks_for_meeting_bool_dict(meeting_id: UUID) -> Dict[GroupMeetingTask, bool]:
    """
    Returns a dictionary from each GroupMeetingTask of the given meeting to a boolean with value False
    """
    group_tasks = {}
    db_tasks = GroupMeetingTask.select(lambda g_t: g_t.group.meeting.id == meeting_id)
    for task in db_tasks:
        group_tasks[task] = False

    return group_tasks


@db_session
def get_tasks_for_code(code: UUID) -> List[Task]:
    return select(gmt.task for gmt in GroupMeetingTask if gmt.group.code == code)[:]


@db_session
def get_meeting_json_data(code: UUID) -> ResultWithData[MeetingJsonData]:
    meeting = get_meeting_by_id(code)
    if meeting is None:
        return get_result_with_error("No meeting with code {0}".format(code))

    groups_tasks = get_tasks_for_meeting(code)
    return get_result_with_data(
        MeetingJsonData(meeting.id, meeting.date, meeting.last_upload, meeting.lp, meeting.meeting_no, groups_tasks))


@db_session
def get_active_group_email_datas_for_meeting(meeting_id: UUID) -> List[GroupMeetingEmailData]:
    group_meetings = list(GroupMeeting.select(
        lambda group_meeting: group_meeting.meeting.id == meeting_id and
                              group_meeting.group.year == "active"))

    gm_email_datas = []
    for group_meeting in group_meetings:
        m = group_meeting.meeting
        group = group_meeting.group.group
        task_names = get_tasks_for_group_meeting(group_meeting)

        gm_email_datas.append(GroupMeetingEmailData(
            meeting=MeetingData(
                id=m.id,
                year=m.year,
                date=m.date,
                last_upload=m.last_upload,
                lp=m.lp,
                meeting_no=m.meeting_no
            ),
            group_name=group.name,
            group_year=group_meeting.group.year,
            group_display_name=group.display_name,
            group_code=group_meeting.code,
            task_names=task_names
        ))

    return gm_email_datas


@db_session
def get_story_group_email_datas_for_meeting(meeting_id: UUID, story_datas: List[StoryData]) -> List[GroupMeetingEmailData]:
    meeting = get_meeting_data_by_id(meeting_id)

    story_email_datas = []
    for story_data in story_datas:
        group_meeting = get_group_meeting(meeting_id, story_data.group, story_data.year)
        task_names = get_tasks_for_group_meeting(group_meeting)
        story_email_datas.append(GroupMeetingEmailData(
            meeting=meeting,
            group_name=story_data.group,
            group_year=group_meeting.group.year,
            group_display_name=group_meeting.group.group.display_name,
            group_code=group_meeting.code,
            task_names=task_names
        ))

    return story_email_datas