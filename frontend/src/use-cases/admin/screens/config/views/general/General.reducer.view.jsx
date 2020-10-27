import {SUBMIT_PASSWORD_SUCCESSFUL} from "../../../password/Password.actions.screen";
import {
    CONFIG_CHANGED,
    CONFIG_HELP_BUTTON_CLICKED,
    ON_SAVE_CONFIGS_FAILED,
    ON_SAVE_CONFIGS_SUCCESSFUL
} from "./General.actions.view";

const initialState = {
    configs: [],
    selectedHelp: null,
    selectedHelpIndex: -1,
    unsavedChanges: false
};

export const GeneralReducer = (state = initialState, action) => {
    switch (action.type) {
        case SUBMIT_PASSWORD_SUCCESSFUL:
            return Object.assign({}, state,
                                 {
                                     configs: action.payload.data.general,
                                     unsavedChanges: false
                                 });
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
                configs: newConfigs,
                unsavedChanges: true
            })
        case CONFIG_HELP_BUTTON_CLICKED:
            let configIndex = action.payload.configIndex;
            let selectedConfig = null;

            if (configIndex === state.selectedHelpIndex) {
                configIndex = -1;
                selectedConfig = null;
            } else if (configIndex >= 0 && configIndex < state.configs.length) {
                selectedConfig = state.configs[configIndex];
            }

            return Object.assign({}, state, {
                selectedHelp: selectedConfig,
                selectedHelpIndex: configIndex
            })
        case ON_SAVE_CONFIGS_SUCCESSFUL:
            return Object.assign({}, state, {
                unsavedChanges: false
            })
        case ON_SAVE_CONFIGS_FAILED:
            return state;
        default:
            return state;
    }
};