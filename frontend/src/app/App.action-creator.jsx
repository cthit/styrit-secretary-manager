import {INIT} from "./App.actions";
import {initApi} from "../api/RequestUtilities";

export function init() {
//    let debug = !process.env.NODE_ENV || process.env.NODE_ENV === "development";
    let debug = false

    if (process.env.REACT_APP_DEBUG_MODE) {
        debug = process.env.REACT_APP_DEBUG_MODE;
    }

    initApi(debug);
    return {
        type: INIT,
        payload: {
            debug: debug
        },
        error: false
    };
}
