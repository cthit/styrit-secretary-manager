import { MEETING_SAVE_FAILED, MEETING_SAVE_SUCCESSFUL } from "./MeetingActions.actions.view";
import { MEETING_SELECTED, NEW_MEETING } from "../../Meeting.actions.view";

const initialState = {errorMsg: ""};

export const MeetingActionsReducer = (state = initialState, action) => {
    switch (action.type) {
        case MEETING_SAVE_FAILED:
            alert("Failed to save meeting.");
            return Object.assign({}, state, {
                errorMsg: action.payload.message
            })
        case MEETING_SAVE_SUCCESSFUL:
            alert("Meeting saved successfully!");
        case NEW_MEETING:
            return Object.assign({}, state, {
                errorMsg: initialState.errorMsg
            })
        case MEETING_SELECTED:
            return Object.assign({}, state, {
                errorMsg: initialState.errorMsg
            })
        default:
            return state;
    }
};