import {postGammaAuth} from "../../../api/post.GammaAuth.api";
import {AUTH_CODE_FAILED, AUTH_CODE_SUCCESSFUL} from "./AuthHandler.actions";
import {handleError} from "../../functions/handleError";
import {authorizeAdmin} from "../../../use-cases/admin/Admin.action-creators";

export function postGammaCode(code) {
    return dispatch => postGammaAuth(code)
        .then(response => {
            dispatch(authorizeAdmin())
            dispatch(
                {
                    type: AUTH_CODE_SUCCESSFUL,
                    error: false
                }
            )
        })
        .catch(error => {
            dispatch(handleError(error, AUTH_CODE_FAILED));
        })
}