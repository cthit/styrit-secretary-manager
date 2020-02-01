import { ON_UPLOAD } from "./Upload.actions.screen";

const initialState = {
    reports: {},
    error: null
};

export const UploadReducer = (state = initialState, action) => {
    switch (action.type) {
        case ON_UPLOAD:
            const file = action.payload.file;
            const task = action.payload.task;
            let newReports = state.reports;
            newReports[task] = file;
            return Object.assign({}, state, {
                reports: newReports,
                error: null
            });
        default:
            return state;
    }
};
