import { SUBMIT_CODE } from "./Code.actions.screen";

const initialState = {
    acceptedCode: null
};

export const CodeReducer = (state = initialState, action) => {
    switch (action.type) {
        case SUBMIT_CODE:
            let code = action.payload.code;
            verifyCode(code);
        default:
            return state;
    }
};

function verifyCode(code) {
    console.log("Verifying code: ", code);
}
