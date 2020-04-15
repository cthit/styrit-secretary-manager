import { INIT } from "./App.actions";
import { initApi } from "../api/RequestUtilities";

export function init() {
    let debug = !process.env.NODE_ENV || process.env.NODE_ENV === "development";
    initApi(debug);
    return {
        type: INIT,
        payload: {
            debug: debug
        },
        error: false
    };
}
