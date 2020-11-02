import {RETRIEVE_CONFIGS_FAILED} from "./Admin.actions";
import {handleError} from "../../common/functions/handleError";
import {SUBMIT_PASSWORD_SUCCESSFUL} from "./screens/password/Password.actions.screen";
import {putPassword} from "../../api/put.Password.api";

export function authorizeAdmin() {
    return dispatch => {
        putPassword("asd123")
            .then(response => {
                dispatch(onAccept(response));
            })
            .catch(error => {
                const headers = error.response.headers;
                if (error.response.status === 401 && headers.location) {
                    window.location.href = headers.location;
                } else {
                    dispatch(handleError(error, RETRIEVE_CONFIGS_FAILED))
                }
            })
    }
}


function onAccept(response, password) {
    // Modify the data here.
    let data = response.data.data;
    let meetings = {};
    data.meetings.forEach(meeting => (meetings[meeting.id] = meeting));
    data.meetings = meetings;

    return {
        type: SUBMIT_PASSWORD_SUCCESSFUL,
        payload: {
            data: data,
            password: password
        },
        error: false
    };
}
