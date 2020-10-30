import {getRequest} from "./RequestUtilities";

export function getGammaMe() {
    return getRequest("/me", false);
}
