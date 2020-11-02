import {AUTH_CODE_FAILED, AUTH_CODE_SUCCESSFUL} from "./AuthHandler.actions";

const initialState = {
    redirectTo: "",
    errors: ""
};

export const AuthHandlerReducer = (state = initialState, action) => {
    switch (action.type) {
        case AUTH_CODE_SUCCESSFUL:
            return Object.assign({}, state, {
                redirectTo: "/admin"
            })
        case AUTH_CODE_FAILED:
            return Object.assign({}, state, {
                errors: action.payload.message,
                redirectTo: ""
            })
        default:
            return state;
    }
};
