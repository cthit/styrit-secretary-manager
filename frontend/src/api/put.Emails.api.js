import {putRequest} from "./RequestUtilities";

export function putEmails(id, password) {
    let data = {
        pass: password,
        id: id
    }

    return putRequest("/mail", data, false);
}
