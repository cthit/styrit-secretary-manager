import {
    SUBMIT_PASSWORD_SUCCESSFUL,
    SUBMIT_PASSWORD_FAILED
} from "./Password.actions.screen";

const initialState = {
    password: null,
    error: null,
    data: null
};

export const PasswordReducer = (state = initialState, action) => {
    switch (action.type) {
        case SUBMIT_PASSWORD_SUCCESSFUL:
            return Object.assign({}, state, {
                error: null,
                password: action.payload.password,
                data: action.payload.data
            });
        case SUBMIT_PASSWORD_FAILED:
            return Object.assign({}, state, {
                error: action.payload.message,
                password: null,
                data: null
            });
        default:
            return state;
    }
};
