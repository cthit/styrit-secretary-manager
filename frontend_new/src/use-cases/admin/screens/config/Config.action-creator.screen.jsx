import { MODE_BUTTON_CLICKED } from "./Config.actions.screen";

export function onModebuttonClicked(mode) {
    return {
        type: MODE_BUTTON_CLICKED,
        payload: {
            mode: mode
        },
        error: false
    };
}
