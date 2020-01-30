import axios from "axios";

let initialized = false;
let path = "";

export function initApi(debugMode) {
    initialized = true;
    if (debugMode) {
        path = "http://localhost:5000";
    }
}

export async function getRequest(endpoint, includePassword = true) {
    if (initialized != true) {
        console.error("API not initialized!");
        return;
    }

    let headers = {};

    if (includePassword) {
        // Do something here!
    }

    return axios
        .get(path + endpoint, { headers })
        .then(response => {
            return response;
        })
        .catch(error => console.error("Received error on endpoint ", endpoint));
}
