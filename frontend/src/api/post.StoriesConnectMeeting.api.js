import {postRequest} from "./RequestUtilities";

export function postStoriesConnectMeeting(meetingId) {
    return postRequest("/admin/config/stories/connect/" + meetingId, null);
}
