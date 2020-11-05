import {getRequest} from "./RequestUtilities";

export function getAdminPage() {
    return getRequest("/admin");
}
