import {postRequest} from "./RequestUtilities";

export function postConfig(configs) {
    let data = {config: configs}
    return postRequest("/admin/config", data);
}
