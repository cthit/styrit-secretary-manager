import {GET_ADMIN_PAGE_SUCCESSFUL} from "./Admin.actions";

const initialState = {
    isAuthorized: false
};

export const AdminReducer = (state = initialState, action) => {
    switch (action.type) {
        case GET_ADMIN_PAGE_SUCCESSFUL:
            return Object.assign({}, state, {
                isAuthorized: true
            });
        default:
            return state;
    }
};
