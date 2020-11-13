import {
    GET_ADMIN_PAGE_FAILED,
    GET_ADMIN_PAGE_SUCCESSFUL
} from "./Admin.actions";

const initialState = {
    isAuthorized: false,
    errorMsg: ""
};

export const AdminReducer = (state = initialState, action) => {
    switch (action.type) {
        case GET_ADMIN_PAGE_SUCCESSFUL:
            return Object.assign({}, state, {
                isAuthorized: true,
                errorMsg: ""
            });
        case GET_ADMIN_PAGE_FAILED:
            return Object.assign({}, state, {
                isAuthorized: false,
                errorMsg: action.payload.message
            })
        default:
            return state;
    }
};
