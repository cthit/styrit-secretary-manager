import {
    SUBMIT_CODE_FAILED,
    SUBMIT_CODE_SUCCESSFUL
} from "./Code.actions.screen";

const initialState = {
    acceptedCode: null,
    error: null
};

export const CodeReducer = (state = initialState, action) => {
    switch (action.type) {
        case SUBMIT_CODE_SUCCESSFUL:
            return Object.assign({}, state, {
                error: null,
                acceptedCode: action.payload.code
            });
        case SUBMIT_CODE_FAILED:
            return Object.assign({}, state, {
                error: action.payload.message
            });
        default:
            return state;
    }
};
