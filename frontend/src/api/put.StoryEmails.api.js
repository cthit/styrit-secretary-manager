import {putRequest} from "./RequestUtilities";

export function putStoryEmails(password) {
    let data = {
        pass: password
    }

    return putRequest("/mail/stories", data, false);
}
