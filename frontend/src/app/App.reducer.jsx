import {combineReducers} from "redux";
import {CodeReducer} from "../use-cases/main/screens/code/Code.reducer.screen";
import {UploadReducer} from "../use-cases/main/screens/upload/Upload.reducer.screen";
import {ConfigReducer} from "../use-cases/admin/screens/config/Config.reducer.screen";
import {MeetingReducer} from "../use-cases/admin/screens/config/views/meeting/Meeting.reducer.view";
import {INIT} from "./App.actions";
import {MeetingActionsReducer} from "../use-cases/admin/screens/config/views/meeting/views/meeting-actions/MeetingActions.reducer.view";
import {GeneralReducer} from "../use-cases/admin/screens/config/views/general/General.reducer.view";
import {StoriesReducer} from "../use-cases/admin/screens/config/views/stories/Stories.reducer.view";
import {AuthHandlerReducer} from "../common/elements/AuthHandler/AuthHandler.reducer";
import {AdminReducer} from "../use-cases/admin/Admin.reducer";

export const rootReducer = combineReducers(
    {
        CodeReducer,
        init,
        UploadReducer,
        ConfigReducer,
        MeetingReducer,
        MeetingActionsReducer,
        GeneralReducer,
        StoriesReducer,
        AuthHandlerReducer,
        AdminReducer
    }
);

export function init(
    state = {
        debug: false
    },
    action
) {
    switch (action.type) {
        case INIT:
            return {
                ...state,
                debug: action.payload.debug
            };
        default:
            return state;
    }
}
