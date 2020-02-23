import { MEETING_SELECTED } from "./Meeting.actions.view";
import { SUBMIT_PASSWORD_SUCCESSFUL } from "../../../password/Password.actions.screen";
import {
    MEETING_DATE_UPDATED,
    MEETING_LAST_UPLOAD_UPDATED,
    MEETING_STUDY_PERIOD_UPDATED,
    MEETING_NUMBER_UPDATED
} from "./views/general-meeting/GeneralMeeting.actions.view";
import { GROUP_TASK_CHANGED } from "./views/meeting-table/MeetingTable.actions.view";
import { TASK_MODE_NONE, TASK_MODE_SOME, TASK_MODE_ALL } from "./TaskModes";

const initialState = {
    meetings: null,
    selectedMeetingID: 0,
    selectedMeeting: null,
    groups: null,
    tasks: null,
    groupCodes: null,
    tasksMode: null
};

export const MeetingReducer = (state = initialState, action) => {
    switch (action.type) {
        case SUBMIT_PASSWORD_SUCCESSFUL:
            return Object.assign({}, state, {
                meetings: action.payload.data.meetings,
                groups: action.payload.data.groups,
                tasks: action.payload.data.tasks
            });
        case MEETING_SELECTED:
            const meetingID = action.payload.meeting;
            const meeting = state.meetings[meetingID];
            const groupCodes = getGroupCodes(meeting, state.groups);
            const newTasksMode = getTasksMode(
                meeting.groups_tasks,
                state.tasks,
                state.groups
            );

            return Object.assign({}, state, {
                selectedMeetingID: meetingID,
                selectedMeeting: meeting,
                groupCodes: groupCodes,
                tasksMode: newTasksMode
            });
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
        case GROUP_TASK_CHANGED:
            const groups_tasks = getGroupsTasks(
                action.payload,
                state.selectedMeeting
            );

            const checkedGroups = groups_tasks[action.payload.task.name];
            const tasksMode = state.tasksMode.map(task => {
                if (task.name === action.payload.task.name) {
                    return Object.assign({}, task, {
                        mode: getTaskMode(checkedGroups, state.groups)
                    });
                }
                return task;
            });

            return Object.assign(
                {},
                updateMeeting(
                    Object.assign({}, state.selectedMeeting, {
                        groups_tasks: groups_tasks
                    }),
                    state.meetings,
                    state.selectedMeetingID,
                    state
                ),
                {
                    tasksMode: tasksMode
                }
            );
        default:
            return state;
    }
};

function updateMeeting(newMeetingObject, meetingsList, id, state) {
    meetingsList[id] = newMeetingObject;

    return Object.assign({}, state, {
        selectedMeeting: newMeetingObject,
        meetings: meetingsList
    });
}

function getGroupsTasks(payload, meeting) {
    const group = payload.group;
    const task = payload.task;
    const groups_tasks = Object.assign({}, meeting.groups_tasks, {});
    const groups = groups_tasks[task.name];

    if (groups) {
        let index = -1;
        groups.forEach((g, i) => {
            if (g.name == group.name) {
                index = i;
            }
        });

        if (index > -1) {
            // Remove it.
            groups.splice(index, 1);
        } else {
            // Add it
            groups.push(group);
        }
    } else {
        // Add both the task and then the group to it.
        groups_tasks[task.name] = [group];
    }

    return groups_tasks;
}

function getGroupCodes(meeting, groups) {
    return Array.from(groups).map(group => {
        let code = "No code generated yet";
        Object.keys(meeting.groups_tasks).forEach(task => {
            Array.from(meeting.groups_tasks[task]).forEach(g => {
                if (g.name === group.name) {
                    code = g.code;
                }
            });
        });

        return {
            name: group.name,
            displayName: group.display_name,
            code: code
        };
    });
}

function getTasksMode(groups_tasks, tasks, allGroups) {
    return Array.from(tasks).map(task => {
        const groups = groups_tasks[task.name];
        let mode = TASK_MODE_NONE;

        mode = getTaskMode(groups, allGroups);

        return {
            name: task.name,
            displayName: task.display_name,
            mode: mode
        };
    });
}

function getTaskMode(checkedGroups, allGroups) {
    let mode = TASK_MODE_NONE;

    if (checkedGroups) {
        if (checkedGroups.length > 0) {
            mode = TASK_MODE_ALL;
            allGroups.forEach(g1 => {
                let found = false;
                checkedGroups.forEach(g2 => {
                    if (g1.name === g2.name) {
                        found = true;
                    }
                });

                if (found === false) {
                    mode = TASK_MODE_SOME;
                }
            });
        }
    }
    return mode;
}
