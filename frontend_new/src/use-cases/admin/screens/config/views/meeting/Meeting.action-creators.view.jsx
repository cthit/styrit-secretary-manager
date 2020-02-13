import { MEETING_SELECTED } from "./Meeting.actions.view";

export function onMeetingSelected(meeting_id) {
    return dispatch =>
        dispatch({
            type: MEETING_SELECTED,
            payload: {
                meeting: meeting_id
            },
            error: false
        });
}
