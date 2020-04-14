import { postRequest } from "./RequestUtilities";

export function postConfig(password, configs) {
    let data = {pass: password, config: configs}
    return postRequest("/admin/config", data, false);
}
