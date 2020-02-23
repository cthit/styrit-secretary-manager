import { GROUP_TASK_CHANGED } from "./MeetingTable.actions.view";

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
