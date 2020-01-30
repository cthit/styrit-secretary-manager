import { SUBMIT_CODE } from "./Code.actions.screen";

export function submitCode(code) {
    return {
        type: SUBMIT_CODE,
        payload: {
            code: code
        },
        error: false
    };
}
