import { ALL_GROUPS_TASK_CHANGED, GROUP_TASK_CHANGED } from "./MeetingTable.actions.view";

export function onGroupTaskClicked(task, group) {
    return {
        type: GROUP_TASK_CHANGED,
        payload: {
            task: task,
            group: group
        },
        error: false
    };
}

export function onAllTasksClicked(task) {
    return {
        type: ALL_GROUPS_TASK_CHANGED,
        payload: {
            task: task
        },
        error: false
    }
}