import { postMeeting } from "../../../../../../../../api/post.Meting.api";
import { MEETING_SAVE_FAILED, MEETING_SAVE_SUCCESSFUL } from "./MeetingActions.actions.view";
import { handleError } from "../../../../../../../../common/functions/handleError";

export function saveMeeting(meeting, groupTasks, allTasks, password) {
    let meetingGTs = {};

    console.log("alltasks:", allTasks);

    Object.keys(allTasks).forEach(task => {
        meetingGTs[task] = [];
    })

    Object.keys(groupTasks).forEach(group => {
        groupTasks[group].tasks.forEach(task => {
            meetingGTs[task].push({
                name: group,
                code: groupTasks[group].code
            })
        })
    })

    meeting.groups_tasks = meetingGTs;

    return dispatch => {
        postMeeting(meeting, password)
            .then(response => {
                return dispatch(onAccept(response));
            })
            .catch(error => {
                return dispatch(onError(error));
            });
    };
}

function onAccept(response) {
    console.log("RESPONSE::", response);

    // Modify the data here.
    let meeting = response.data;

    return {
        type: MEETING_SAVE_SUCCESSFUL,
        payload: {
            meeting: meeting
        },
        error: false
    };
}


function onError(error) {
    return handleError(error, MEETING_SAVE_FAILED);
}
