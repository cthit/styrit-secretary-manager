import {getRequest} from "./RequestUtilities";

export function getIsAuthorized() {
    return getRequest("/auth/verify", false);
}
