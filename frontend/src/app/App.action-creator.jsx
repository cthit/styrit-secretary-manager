import {INIT} from "./App.actions";
import {initApi} from "../api/RequestUtilities";

export function init() {
    let debug = false

    if (process.env.REACT_APP_DEBUG_MODE === true || process.env.NODE_ENV === "development") {
        debug = true;
    }

    initApi();
    return {
        type: INIT,
        payload: {
            debug: debug
        },
        error: false
    };
}
