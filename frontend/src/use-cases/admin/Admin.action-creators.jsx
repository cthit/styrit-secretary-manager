import {NOT_AUTHORIZED} from "./Admin.actions";

export function onNotAuthorized() {
    return {
        type: NOT_AUTHORIZED,
        payload: {},
        error: false
    };
}
