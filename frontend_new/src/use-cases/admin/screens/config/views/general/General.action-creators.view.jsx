import { CONFIG_CHANGED } from "./General.actions.view";

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