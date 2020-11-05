import {postRequest} from "./RequestUtilities";

export function postGammaAuth(code) {
    return postRequest("/auth", {code: code});
}
