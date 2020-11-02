import {getGammaMe} from "../../../../api/get.GammaMe.api";
import {GAMMA_ME_FAILED, GAMMA_ME_SUCCESSFUL} from "./Gamma.actions.screen";
import {WAITING_FOR_RESULT} from "../config/views/meeting/views/meeting-actions/MeetingActions.actions.view";
import {putPassword} from "../../../../api/put.Password.api";
import {handleError} from "../../../../common/functions/handleError";
import {RETRIEVE_CONFIGS_FAILED} from "../../Admin.actions";
import {SUBMIT_PASSWORD_SUCCESSFUL} from "../password/Password.actions.screen";

export function onLoginWithGamma() {
    return dispatch => {
        dispatch({
                     type: WAITING_FOR_RESULT
                 })
        getGammaMe()
            .then(response => {
                dispatch(
                    {
                        type: GAMMA_ME_SUCCESSFUL,
                        payload: {},
                        error: false
                    })
            })
            .catch(err => {
                if (err.response.status === 401) {
                    window.location.href = err.response.headers.location;
                } else {
                    dispatch(
                        {
                            type: GAMMA_ME_FAILED,
                            payload: {},
                            error: true
                        });
                }
            })
    }
}


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