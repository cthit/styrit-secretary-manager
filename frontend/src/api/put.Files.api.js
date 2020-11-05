import {putRequest} from "./RequestUtilities";

export function putFiles(reports, code, group) {
    let data = new FormData();
    Object.keys(reports).forEach(key => {
        data.append(key, reports[key]);
    });

    data.append("code", code);
    data.append("group", group);

    return putRequest("/file", data);
}
