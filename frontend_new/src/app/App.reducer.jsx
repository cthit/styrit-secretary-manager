import { combineReducers } from "redux";
import { CodeReducer } from "../use-cases/main/screens/code/Code.reducer.screen";
import { INIT } from "./App.actions";

export const rootReducer = combineReducers({
    CodeReducer,
    init
});

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
