import { MEETING_SELECTED, NEW_MEETING, NO_MEETING_SELECTED } from "./Meeting.actions.view";

export function onMeetingSelected(meeting_id) {
    if (meeting_id === null) {
        return {
            type: NO_MEETING_SELECTED,
            payload: {},
            error: false
        }
    }

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
        payload: {},
        error: false
    }
}