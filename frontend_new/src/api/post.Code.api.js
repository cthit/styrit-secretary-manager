import { postRequest } from "./RequestUtilities";

export function postCode(code, onAccepted, onError) {
    return postRequest("/code", { code: code }, false);
}
