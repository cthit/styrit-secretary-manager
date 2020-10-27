import {
    CONFIG_CHANGED,
    CONFIG_HELP_BUTTON_CLICKED
} from "./General.actions.view";
import {postConfig} from "../../../../../../api/post.Config.api";
import {handleError} from "../../../../../../common/functions/handleError";

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
    postConfig(password, configs).then(response => {
        onSaveConfigAccepted(response);
    }).catch(error => {
        onSaveConfigFailed(error);
    })
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
}

function onSaveConfigFailed(error) {
    alert("Failed saving config, '" + handleError(error, "").payload.message + "'");
}