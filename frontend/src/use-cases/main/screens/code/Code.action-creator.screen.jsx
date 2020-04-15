import { SUBMIT_CODE_FAILED, SUBMIT_CODE_SUCCESSFUL } from "./Code.actions.screen";
import { postCode } from "../../../../api/post.Code.api";
import { handleError } from "../../../../common/functions/handleError";

export function submitCode(code) {
    const formattedCode = code.replace(/\s/g, '');
    return dispatch => {
        postCode(formattedCode)
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
    return handleError(error, SUBMIT_CODE_FAILED);
}
