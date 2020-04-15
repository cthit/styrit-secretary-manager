import { postRequest } from "./RequestUtilities";

export function postDeadline(meetingID, password) {
    return postRequest("/timer/" + meetingID, {pass: password}, false);
}
