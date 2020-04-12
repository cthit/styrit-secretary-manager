import {MEETING_SELECTED, NEW_MEETING} from "./Meeting.actions.view";

export function onMeetingSelected(meeting_id) {
    return {
        type: MEETING_SELECTED,
        payload: {
            meeting: meeting_id
        },
        error: false
    };
}

export function onNewMeeting() {
    return {
        type: NEW_MEETING,
        payload: {

        },
        error: false
    }
}