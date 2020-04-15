import { putRequest } from "./RequestUtilities";

export function putEmails(id, password) {
    let data = {
        pass: password,
        id: id
    }

    console.log("PUTING TO SERVER :", data);
    return putRequest("/mail", data, false);
}
