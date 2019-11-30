import { SUBMIT_CODE } from "./Main.Actions";

export function submitCode(code) {
    return {
        type: SUBMIT_CODE,
        code: code
    };
}
