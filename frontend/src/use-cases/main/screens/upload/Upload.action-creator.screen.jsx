import {
    ON_FILEUPLOAD_FINISHED,
    ON_SUBMIT_FILES_FAILED,
    ON_UPLOAD
} from "./Upload.actions.screen";
import {putFiles} from "../../../../api/put.Files.api";
import {handleError} from "../../../../common/functions/handleError";

export function onUpload(file, task) {
    return {
        type: ON_UPLOAD,
        payload: {
            file: file,
            task: task
        },
        error: false
    };
}

export function onSubmitFiles(reports, code, group) {
    return dispatch => {
        putFiles(reports, code, group)
            .then(response => {
                return dispatch(onAccept(response));
            })
            .catch(error => {
                return dispatch(onError(error));
            });
    };
}

function onAccept(response) {
    let overwrite = false;
    if (response.data && response.data.data) {
        overwrite = response.data.data.overwrite;
    }

    let msg =
        "File uppladad, om du vill byta ut en fil är det bara att skriva in koden igen och ladda upp en ny fil.";
    if (overwrite) {
        msg = msg + "\nSkrev över tidigare uppladdad fil.";
    }

    alert(msg);

    return onConfirmFilesUploaded();
}

function onError(error) {
    return handleError(error, ON_SUBMIT_FILES_FAILED);
}

function onConfirmFilesUploaded() {
    // Reset the state to code input.
    return {
        type: ON_FILEUPLOAD_FINISHED,
        payload: {},
        error: false
    };
}
