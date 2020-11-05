import {putRequest} from "./RequestUtilities";

export function putEmails(id) {
    let data = {
        id: id
    }

    return putRequest("/mail", data);
}
