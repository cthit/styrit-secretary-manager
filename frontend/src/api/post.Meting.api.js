import {postRequest} from "./RequestUtilities";

export function postMeeting(meeting, password) {
    let data = {
        pass: password,
        meeting: meeting
    }

    return postRequest("/admin/config/meeting", data, false);
}
