import {NOT_AUTHORIZED} from "./Admin.actions";
import {getIsAuthorized} from "../../api/get.IsAuthorized.api";

export function onNotAuthorized() {
    return {
        type: NOT_AUTHORIZED,
        payload: {},
        error: false
    };
}

export function verifyAuthorized() {
    return dispatch => {
        getIsAuthorized()
            .then(response => {
                console.log("RES", response);
                return dispatch({});
            })
            .catch(error => {
                console.log("ERRRROROROROROROROR", error);
                return dispatch({});
            })
    };
}
