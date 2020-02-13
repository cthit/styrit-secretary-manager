import { MEETING_SELECTED } from "./Meeting.actions.view";

const initialState = {
    selectedMeeting: null
};

export const MeetingReducer = (state = initialState, action) => {
    switch (action.type) {
        case MEETING_SELECTED:
            return Object.assign({}, state, {
                selectedMeeting: action.payload.meeting
            });
        default:
            return state;
    }
};
