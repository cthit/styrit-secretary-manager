import { MEETING_SELECTED } from "./Meeting.actions.view";
import { SUBMIT_PASSWORD_SUCCESSFUL } from "../../../password/Password.actions.screen";

const initialState = {
    meetings: {},
    selectedMeetingID: 0,
    selectedMeeting: null
};

export const MeetingReducer = (state = initialState, action) => {
    switch (action.type) {
        case SUBMIT_PASSWORD_SUCCESSFUL:
            console.log("Got the following data", action.payload);
            return Object.assign({}, state, {
                meetings: action.payload.data.meetings
            });
        case MEETING_SELECTED:
            const meetingID = action.payload.meeting;
            const meeting = state.meetings[meetingID];

            return Object.assign({}, state, {
                selectedMeetingID: meetingID,
                selectedMeeting: meeting
            });
        default:
            return state;
    }
};
