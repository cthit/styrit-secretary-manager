import { postRequest } from "./RequestUtilities";

export function postArchive(meetingID) {
    return postRequest("/archive/" + meetingID, {}, false);
}
