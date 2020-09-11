import {SUBMIT_PASSWORD_SUCCESSFUL} from "../../../password/Password.actions.screen";
import {CONFIG_CHANGED} from "./General.actions.view";

const initialState = {
    configs: []
};

export const GeneralReducer = (state = initialState, action) => {
    switch (action.type) {
        case SUBMIT_PASSWORD_SUCCESSFUL:
            return Object.assign({}, state, {configs: action.payload.data.general});
        case CONFIG_CHANGED:
            let newConfigs = [];
            state.configs.forEach(config => {
                if (action.payload.config === config.key) {
                    newConfigs.push(
                        {
                            key: config.key,
                            value: action.payload.value,
                            type: config.type
                        })
                } else {
                    newConfigs.push(config);
                }
            })
            return Object.assign({}, state, {
                configs: newConfigs
            })
        default:
            return state;
    }
};