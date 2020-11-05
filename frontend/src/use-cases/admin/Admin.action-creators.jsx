import {
    GET_ADMIN_PAGE_FAILED,
    GET_ADMIN_PAGE_SUCCESSFUL
} from "./Admin.actions";
import {handleError} from "../../common/functions/handleError";
import {getAdminPage} from "../../api/get.AdminPage.api";
import {authorizedApiCall} from "../../common/functions/authorizedApiCall";

export function authorizeAdmin() {
    return dispatch => {
        authorizedApiCall(() => getAdminPage())
            .then(response => {
                if (response.error) {
                    dispatch(handleError(response.errResponse, GET_ADMIN_PAGE_FAILED));
                } else {
                    dispatch(onAccept(response.response));
                }
            })
            .catch(error => {
                dispatch(handleError(error, GET_ADMIN_PAGE_FAILED));
            })
    }
}


function onAccept(response) {
    // Modify the data here.
    let data = response.data.data;
    let meetings = {};
    data.meetings.forEach(meeting => (meetings[meeting.id] = meeting));
    data.meetings = meetings;

    return {
        type: GET_ADMIN_PAGE_SUCCESSFUL,
        payload: {
            data: data
        },
        error: false
    };
}
