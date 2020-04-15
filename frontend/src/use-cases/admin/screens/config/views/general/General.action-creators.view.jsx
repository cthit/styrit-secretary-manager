import { CONFIG_CHANGED } from "./General.actions.view";
import { postConfig } from "../../../../../../api/post.Config.api";
import { handleError } from "../../../../../../common/functions/handleError";

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

function onSaveConfigAccepted(response) {
    console.log("Response", response);
    alert("Saving configs successful");
}

function onSaveConfigFailed(error) {
    alert("Failed saving config, '" + handleError(error, "").payload.message + "'");
}
