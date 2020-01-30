import { SUBMIT_CODE } from "./Code.Actions.screen";

const initialState = {
    code: "",
    acceptedCode: null
};

export const MainReducer = (state = initialState, action) => {
    switch (action.type) {
        case SUBMIT_CODE:
        //            return Object.assign({}, state, (state.code = ))
    }
};
