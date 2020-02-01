import {
    SUBMIT_CODE_SUCCESSFUL,
    SUBMIT_CODE_FAILED
} from "./Code.actions.screen";
import { postCode } from "../../../../api/post.Code.api";

export function submitCode(code) {
    return dispatch => {
        postCode(code)
            .then(response => {
                return dispatch(onAccept(response));
            })
            .catch(error => {
                return dispatch(onError(error));
            });
    };
}

function onAccept(response) {
    console.log("RESPONSE::", response);
    return {
        type: SUBMIT_CODE_SUCCESSFUL,
        payload: {
            ...response.data
        },
        error: false
    };
}

function onError(error) {
    console.error("ERROR::", error);
    let data = error.response.data;
    let msg = "Woops, something went wrong.";
    if (data && data.error) {
        msg = data.error;
    }

    return {
        type: SUBMIT_CODE_FAILED,
        payload: {
            message: msg
        },
        error: true
    };
}
