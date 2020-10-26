import {getRequest} from "./RequestUtilities";

export function getArchiveUrl(meetingID) {
    return getRequest("/archive/url/" + meetingID, false);
}
