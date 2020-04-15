import { meeting_mode } from "./Config.modes.screen";
import { MODE_BUTTON_CLICKED } from "./Config.actions.screen";

const initialState = {
    mode: meeting_mode
};

export const ConfigReducer = (state = initialState, action) => {
    switch (action.type) {
        case MODE_BUTTON_CLICKED:
            return Object.assign({}, state, {
                mode: action.payload.mode
            });
        default:
            return state;
    }
};
