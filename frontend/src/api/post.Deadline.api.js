import {postRequest} from "./RequestUtilities";

export function postDeadline(meetingID) {
    return postRequest("/timer/" + meetingID);
}
