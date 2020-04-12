import {MEETING_SELECTED, NEW_MEETING} from "./Meeting.actions.view";
import { SUBMIT_PASSWORD_SUCCESSFUL } from "../../../password/Password.actions.screen";
import {
    MEETING_DATE_UPDATED,
    MEETING_LAST_UPLOAD_UPDATED,
    MEETING_STUDY_PERIOD_UPDATED,
    MEETING_NUMBER_UPDATED
} from "./views/general-meeting/GeneralMeeting.actions.view";
import { GROUP_TASK_CHANGED } from "./views/meeting-table/MeetingTable.actions.view";
import { TASK_MODE_NONE, TASK_MODE_SOME, TASK_MODE_ALL } from "./TaskModes";

// const initialState = {
//     meetings: null,
//     selectedMeetingID: 0,
//     selectedMeeting: null,
//     groups: null,
//     tasks: null,
//     groupCodes: null,
//     tasksMode: null
// };

const initialState = {
    meetings: null,
    selectedMeetingID: 0,
    selectedMeeting: null,
    groups: {}, // A dictionary from a group name to a group display name.
    tasks: {}, // A dictionary from a task name to a task display name.
    taskMode: {}, // A dictionary from a task name to a task mode.
    groupTasks: {} // A dictionary from a group to all its code and tasks.
};

export const MeetingReducer = (state = initialState, action) => {
    switch (action.type) {
        case SUBMIT_PASSWORD_SUCCESSFUL:
            const groupsMap = {};
            action.payload.data.groups.forEach(group => {
                groupsMap[group.name] = group.display_name;
            });
            const tasksMap = {};
            action.payload.data.tasks.forEach(task => {
                tasksMap[task.name] = task.display_name;
            });

            return Object.assign({}, state, {
                meetings: action.payload.data.meetings,
                groups: groupsMap,
                tasks: tasksMap
            });
        case MEETING_SELECTED:
            const meetingID = action.payload.meeting;
            const meeting = state.meetings[meetingID];
            const groupTasks = getGroupsTasks(
                state.groups,
                meeting.groups_tasks
            );

            const taskMode = getTasksMode(state.tasks, groupTasks);

            return Object.assign({}, state, {
                selectedMeetingID: meetingID,
                selectedMeeting: meeting,
                groupTasks: groupTasks,
                taskMode: taskMode
            });
        case GROUP_TASK_CHANGED:
            const newGroupsTasks = updateTasks(
                action.payload.group,
                action.payload.task,
                state.groupTasks
            );
            return Object.assign({}, state, {
                groupTasks: newGroupsTasks
            });
        // General meeting information.
        case MEETING_DATE_UPDATED:
            return updateMeeting(
                Object.assign({}, state.selectedMeeting, {
                    date: action.payload.date
                }),
                state.meetings,
                state.selectedMeetingID,
                state
            );
        case MEETING_LAST_UPLOAD_UPDATED:
            return updateMeeting(
                Object.assign({}, state.selectedMeeting, {
                    last_upload_date: action.payload.date
                }),
                state.meetings,
                state.selectedMeetingID,
                state
            );
        case MEETING_STUDY_PERIOD_UPDATED:
            return updateMeeting(
                Object.assign({}, state.selectedMeeting, {
                    lp: action.payload.study_period
                }),
                state.meetings,
                state.selectedMeetingID,
                state
            );
        case MEETING_NUMBER_UPDATED:
            return updateMeeting(
                Object.assign({}, state.selectedMeeting, {
                    meeting_no: action.payload.meeting_no
                }),
                state.meetings,
                state.selectedMeetingID,
                state
            );
        case NEW_MEETING:
            const newMeeting = {
                id: "new",
                groups_tasks: {},
                date: new Date(),
                last_upload_date: new Date(),
                lp: 0,
                meeting_no: 0
            }
            const oldMeetings = state.meetings;
            oldMeetings[newMeeting.id] = newMeeting;
            const newMeetings = Object.assign({}, oldMeetings);

            const newMeetingGroupsTasks = getGroupsTasks(state.groups, newMeeting.groups_tasks);

            return Object.assign({}, state, {
                selectedMeetingID: newMeeting.id,
                selectedMeeting: newMeeting,
                groupsTasks: newMeetingGroupsTasks,
                taskMode: getTasksMode(state.tasks, newMeetingGroupsTasks),
                meetings: newMeetings
            });

        default:
            return state;
    }
};

function getGroupsTasks(allGroups, groups_tasks) {
    const groupsTasks = {};
    Object.keys(allGroups).forEach(group => {
        groupsTasks[group] = {
            code: null,
            tasks: []
        };
    });

    Object.keys(groups_tasks).forEach(task => {
        groups_tasks[task].forEach(group => {
            groupsTasks[group.name].tasks.push(task);
            groupsTasks[group.name].code = group.code;
        });
    });
    return groupsTasks;
}

function updateMeeting(newMeetingObject, meetingsList, id, state) {
    meetingsList[id] = newMeetingObject;

    return Object.assign({}, state, {
        selectedMeeting: newMeetingObject,
        meetings: meetingsList
    });
}

function getTasksMode(allTasks, groupsTasks) {
    const taskMode = {};
    Object.keys(allTasks).forEach(task => {
        taskMode[task] = TASK_MODE_NONE;
        let allTasks = true;
        Object.keys(groupsTasks).forEach(group => {
            const gt = groupsTasks[group];
            if (gt.tasks.includes(task)) {
                taskMode[task] = TASK_MODE_SOME;
            } else {
                allTasks = false;
            }
        });

        if (allTasks) {
            taskMode[task] = TASK_MODE_ALL;
        }
    });
    return taskMode;
}

function updateTasks(group, task, groupTasks) {
    let tasks_list = groupTasks[group].tasks.slice();
    let index = -1;
    tasks_list.forEach((t, i) => {
        if (t === task) {
            index = i;
        }
    });

    if (index > -1) {
        tasks_list = tasks_list.slice(index);
    } else {
        tasks_list.push(task);
    }
    groupTasks[task] = Object.assign({}, groupTasks[group], {
        tasks: tasks_list
    });
    return groupTasks;
}
