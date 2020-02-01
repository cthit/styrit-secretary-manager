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
            code: response.data.code,
            data: response.data.data
        },
        error: false
    };
}

function onError(error) {
    console.error("ERROR::", error);
    let msg = "Woops, something went wrong.";
    if (error.response) {
        let data = error.response.data;
        if (data && data.error) {
            msg = data.error;
        }
    }

    return {
        type: SUBMIT_CODE_FAILED,
        payload: {
            message: msg
        },
        error: true
    };
}
