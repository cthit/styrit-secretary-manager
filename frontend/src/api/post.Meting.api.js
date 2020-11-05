import {postRequest} from "./RequestUtilities";

export function postMeeting(meeting) {
    let data = {
        meeting: meeting
    }

    return postRequest("/admin/config/meeting", data);
}
