import axios from "axios";

let initialized = false;
let path = "/api";

export function initApi(debugMode) {
    initialized = true;
    if (debugMode) {
        path = "http://localhost:5000/api";
    }
}

export function getRequest(endpoint, includePassword = true) {
    if (initialized !== true) {
        console.error("API not initialized!");
        return;
    }

    let headers = {};

    if (includePassword) {
        // Do something here!
    }

    return axios.get(path + endpoint, { headers });
}

export function postRequest(endpoint, data, includePassword = true) {
    if (initialized !== true) {
        console.error("API not initialized!");
        return;
    }

    let headers = {};

    if (includePassword) {
        // Do something here!
    }

    return axios.post(path + endpoint, data, { headers });
}

export function putRequest(endpoint, data, includePassword = true) {
    if (initialized !== true) {
        console.error("API not initialized!");
        return;
    }

    let headers = {};

    if (includePassword) {
        // Do something here!
    }

    return axios.put(path + endpoint, data, { headers });
}
