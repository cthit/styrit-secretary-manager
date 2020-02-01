import { ON_UPLOAD } from "./Upload.actions.screen";

export function onUpload(file, task) {
    return {
        type: ON_UPLOAD,
        payload: {
            file: file,
            task: task
        },
        error: false
    };
}
