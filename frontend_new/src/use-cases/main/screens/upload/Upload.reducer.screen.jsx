import {
    ON_UPLOAD,
    ON_SUBMIT_FILES_FAILED,
    ON_FILEUPLOAD_FINISHED
} from "./Upload.actions.screen";

const initialState = {
    reports: {},
    error: null,
    noSubmit: true
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
                noSubmit: false
            });
        case ON_SUBMIT_FILES_FAILED:
            return Object.assign({}, state, {
                error: action.payload.message
            });
        case ON_FILEUPLOAD_FINISHED:
            return initialState;
        default:
            return state;
    }
};
