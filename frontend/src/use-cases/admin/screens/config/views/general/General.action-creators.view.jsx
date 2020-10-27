import {
    CONFIG_CHANGED,
    CONFIG_HELP_BUTTON_CLICKED,
    ON_SAVE_CONFIGS_FAILED,
    ON_SAVE_CONFIGS_SUCCESSFUL
} from "./General.actions.view";
import {postConfig} from "../../../../../../api/post.Config.api";
import {handleError} from "../../../../../../common/functions/handleError";
import {WAITING_FOR_RESULT} from "../meeting/views/meeting-actions/MeetingActions.actions.view";

export function onConfigChange(configKey, newVal) {
    return {
        type: CONFIG_CHANGED,
        payload: {
            config: configKey,
            value: newVal
        },
        error: false
    }
}

export function saveConfig(password, configs) {
    return dispatch => {
        dispatch({
                     type: WAITING_FOR_RESULT
                 })
        postConfig(password, configs)
            .then(response => {
                dispatch(onSaveConfigAccepted(response));
            }).catch(error => {
            dispatch(onSaveConfigFailed(error));
        })
    }
}

export function configHelpButtonPressed(configIndex) {
    return {
        type: CONFIG_HELP_BUTTON_CLICKED,
        payload: {
            configIndex: configIndex
        },
        error: false
    }
}

function onSaveConfigAccepted(response) {
    alert("Saving configs successful");
    return {
        type: ON_SAVE_CONFIGS_SUCCESSFUL,
        payload: {},
        error: false
    }
}

function onSaveConfigFailed(error) {
    alert("Failed saving config, '" + handleError(error, "").payload.message + "'");
    return {
        type: ON_SAVE_CONFIGS_FAILED,
        payload: {},
        error: true
    }
}