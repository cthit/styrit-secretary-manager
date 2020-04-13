import { postMeeting } from "../../../../../../../../../../api/post.Meting.api";
import { MEETING_SAVE_FAILED, MEETING_SAVE_SUCCESSFUL } from "./MeetingActions.actions.view";
import { handleError } from "../../../../../../../../../../common/functions/handleError";

export function saveMeeting(meeting, password) {
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
