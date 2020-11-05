import {postRequest} from "./RequestUtilities";

export function postCode(code) {
    return postRequest("/code/" + code, {});
}
