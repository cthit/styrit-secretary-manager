import { postRequest } from "./RequestUtilities";

export function postMeeting(meeting, password) {
    let data = {
        pass: password,
        meeting: meeting
    }

    console.log("POSTING TO SERVER :", data);
    return postRequest("/admin/config/meeting", data, false);
}
