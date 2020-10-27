import {
    MEETING_SELECTED,
    NEW_MEETING,
    NO_MEETING_SELECTED
} from "./Meeting.actions.view";
import {SUBMIT_PASSWORD_SUCCESSFUL} from "../../../password/Password.actions.screen";
import {
    MEETING_DATE_UPDATED,
    MEETING_LAST_UPLOAD_UPDATED,
    MEETING_NUMBER_UPDATED,
    MEETING_STUDY_PERIOD_UPDATED
} from "./views/general-meeting/GeneralMeeting.actions.view";
import {
    ALL_GROUPS_TASK_CHANGED,
    GROUP_TASK_CHANGED
} from "./views/meeting-table/MeetingTable.actions.view";
import {TASK_MODE_ALL, TASK_MODE_NONE, TASK_MODE_SOME} from "./TaskModes";
import {MEETING_SAVE_SUCCESSFUL} from "./views/meeting-actions/MeetingActions.actions.view";

const initialState = {
    meetings: {},
    groups: {}, // A dictionary from a group name to a group display name.
    tasks: {}, // A dictionary from a task name to a task display name.
    selectedMeetingID: 0,
    selectedMeeting: null,
    taskMode: {}, // A dictionary from a task name to a task mode.
    groupTasks: {}, // A dictionary from a group to all its code and tasks.
    unsavedChangesList: [] // A list of all the meetingIds that have unchanged changes.
};

export const MeetingReducer = (state = initialState, action) => {
    switch (action.type) {
        case SUBMIT_PASSWORD_SUCCESSFUL:
            return Object.assign({}, state, getMeetingsData(action.payload.data));
        case MEETING_SAVE_SUCCESSFUL:
            const receivedMeeting = action.payload.meeting;
            const receivedGroupTasks = getGroupsTasks(state.groups, receivedMeeting.groups_tasks);
            let newMeetingsDict = {}
            newMeetingsDict[receivedMeeting.id] = receivedMeeting;
            Object.keys(state.meetings).forEach(key => {
                if (key !== "new" && receivedMeeting.id !== key) {
                    newMeetingsDict[key] = state.meetings[key]
                }
            })

            return Object.assign({}, state, {
                selectedMeeting: receivedMeeting,
                selectedMeetingID: receivedMeeting.id,
                groupTasks: receivedGroupTasks,
                meetings: newMeetingsDict,
                taskMode: getTasksMode(state.tasks, receivedGroupTasks),
                unsavedChangesList: removeUnsavedChanges(state.unsavedChangesList, state.selectedMeetingID)
            })

        case NEW_MEETING:
            const newMeeting = {
                id: "new",
                groups_tasks: {},
                date: new Date(),
                last_upload_date: new Date(),
                lp: 1,
                meeting_no: 0
            }
            const oldMeetings = state.meetings;
            oldMeetings[newMeeting.id] = newMeeting;
            const newMeetings = Object.assign({}, oldMeetings);

            const newMeetingGroupsTasks = getGroupsTasks(state.groups, newMeeting.groups_tasks);

            return Object.assign({}, state, {
                selectedMeetingID: newMeeting.id,
                selectedMeeting: newMeeting,
                groupTasks: newMeetingGroupsTasks,
                taskMode: getTasksMode(state.tasks, newMeetingGroupsTasks),
                meetings: newMeetings,
                unsavedChangesList: addUnsavedChanges(state.unsavedChangesList, "new")
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
        case NO_MEETING_SELECTED:
            return Object.assign({}, state, {
                selectedMeetingID: initialState.selectedMeetingID,
                selectedMeeting: initialState.selectedMeeting,
                taskMode: initialState.taskMode,
                groupTasks: initialState.groupTasks
            })
        case GROUP_TASK_CHANGED:
            const newGroupsTasks = updateTasks(
                action.payload.group,
                action.payload.task,
                state.groupTasks
            );
            return Object.assign({}, state, {
                groupTasks: newGroupsTasks,
                taskMode: getTasksMode(state.tasks, newGroupsTasks),
                unsavedChangesList: addUnsavedChanges(state.unsavedChangesList, state.selectedMeetingID)
            });
        case ALL_GROUPS_TASK_CHANGED:
            const updatedTask = action.payload.task;
            const newGroupsTasks2 = updateAllTasks(
                updatedTask,
                state.taskMode[updatedTask],
                state.groupTasks
            );

            return Object.assign({}, state, {
                groupTasks: newGroupsTasks2,
                taskMode: getTasksMode(state.tasks, newGroupsTasks2),
                unsavedChangesList: addUnsavedChanges(state.unsavedChangesList, state.selectedMeetingID)
            })
        // General meeting information.
        case MEETING_DATE_UPDATED:
            return updateMeeting(
                Object.assign({}, state.selectedMeeting, {
                    date: action.payload.date
                }),
                state.meetings,
                state.selectedMeetingID,
                state,
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
        meetings: meetingsList,
        unsavedChangesList: addUnsavedChanges(state.unsavedChangesList, state.selectedMeetingID)
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
    const newGroupTasks = Object.assign({}, groupTasks);
    let newTasksList = []
    let found = false;
    newGroupTasks[group].tasks.forEach(currTask => {
        if (currTask === task) {
            found = true;
        } else {
            newTasksList.push(currTask);
        }
    })

    if (found === false) {
        newTasksList.push(task);
    }
    newGroupTasks[group] = Object.assign({}, groupTasks[group], {
        tasks: newTasksList
    });
    return newGroupTasks;
}

function updateAllTasks(task, taskMode, groupTasks) {
    let newGroupTasks = Object.assign({}, groupTasks);

    Object.keys(groupTasks).forEach(group => {
        let newTaskList = []
        groupTasks[group].tasks.forEach(groupTask => {
            if (!(groupTask === task)) {
                newTaskList.push(groupTask);
            }
        });

        if (taskMode !== TASK_MODE_ALL) {
            newTaskList.push(task);
        }
        newGroupTasks[group].tasks = newTaskList;
    });
    return newGroupTasks;
}

function getMeetingsData(data) {
    const groupsMap = {};
    data.groups.forEach(group => {
        groupsMap[group.name] = group.display_name;
    });
    const tasksMap = {};
    data.tasks.forEach(task => {
        tasksMap[task.name] = task.display_name;
    });

    return {
        meetings: data.meetings,
        groups: groupsMap,
        tasks: tasksMap,
        selectedMeeting: null,
        selectedMeetingID: 0,
        unsavedChangesList: []
    };
}

function removeUnsavedChanges(unsavedChangesList, meetingId) {
    let newUnsavedChanges = [];
    unsavedChangesList.forEach(meeting => {
        if (meeting !== meetingId) {
            newUnsavedChanges.push(meeting);
        }
    })
    return newUnsavedChanges;
}

function addUnsavedChanges(unsavedChangesList, meetingId) {
    let newUnsavedChanges = unsavedChangesList.slice();
    if (newUnsavedChanges.includes(meetingId) === false) {
        newUnsavedChanges.push(meetingId);
    }
    return newUnsavedChanges;
}