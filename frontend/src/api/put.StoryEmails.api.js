import {putRequest} from "./RequestUtilities";

export function putStoryEmails(meeting_id) {
    let data = {
        id: meeting_id
    }

    return putRequest("/mail/stories", data);
}
