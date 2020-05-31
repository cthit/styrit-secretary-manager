import {SUBMIT_PASSWORD_FAILED, SUBMIT_PASSWORD_SUCCESSFUL} from "./Password.actions.screen";

const initialState = {
    password: null,
    passwordVerified: false,
    error: null
};

export const PasswordReducer = (state = initialState, action) => {
    switch (action.type) {
        case SUBMIT_PASSWORD_SUCCESSFUL:
            return Object.assign({}, state, {
                error: null,
                passwordVerified: true,
                password: action.payload.password
            });
        case SUBMIT_PASSWORD_FAILED:
            return Object.assign({}, state, {
                error: action.payload.message,
                password: null,
                passwordVerified: false,
                data: null
            });
        default:
            return state;
    }
};
