import {putRequest} from "./RequestUtilities";

export function putStoryEmails(password, meeting_id) {
    let data = {
        pass: password,
        id: meeting_id
    }

    return putRequest("/mail/stories", data, false);
}
