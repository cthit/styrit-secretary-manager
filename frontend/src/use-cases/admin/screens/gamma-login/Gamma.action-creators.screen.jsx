import {getGammaMe} from "../../../../api/get.GammaMe.api";
import {GAMMA_ME_FAILED, GAMMA_ME_SUCCESSFUL} from "./Gamma.actions.screen";
import {WAITING_FOR_RESULT} from "../config/views/meeting/views/meeting-actions/MeetingActions.actions.view";

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
                console.log("Received error", err)
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