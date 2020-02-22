import { MEETING_SELECTED } from "./Meeting.actions.view";
import { SUBMIT_PASSWORD_SUCCESSFUL } from "../../../password/Password.actions.screen";
import {
    MEETING_DATE_UPDATED,
    MEETING_LAST_UPLOAD_UPDATED,
    MEETING_STUDY_PERIOD_UPDATED,
    MEETING_NUMBER_UPDATED
} from "./views/general-meeting/GeneralMeeting.actions.view";

const initialState = {
    meetings: {},
    selectedMeetingID: 0,
    selectedMeeting: null
};

export const MeetingReducer = (state = initialState, action) => {
    switch (action.type) {
        case SUBMIT_PASSWORD_SUCCESSFUL:
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
        case MEETING_DATE_UPDATED:
            return updateMeeting(
                Object.assign({}, state.selectedMeeting, {
                    date: action.payload.date
                }),
                state.meetings,
                state.selectedMeetingID,
                state
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

function updateMeeting(newMeetingObject, meetingsList, id, state) {
    meetingsList[id] = newMeetingObject;

    return Object.assign({}, state, {
        selectedMeeting: newMeetingObject,
        meetings: meetingsList
    });
}
