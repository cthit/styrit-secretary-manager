import { putRequest } from "./RequestUtilities";

export function putPassword(password) {
    return putRequest("/admin", { pass: password }, false);
}
