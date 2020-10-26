export function handleError(error, type) {
    let msg = "Woops, something went wrong.";
    if (error.response) {
        let data = error.response.data;
        if (data && data.error) {
            if (data.error.isError) {
                msg = data.error.message
            } else {
                // TODO: This is for old endpoints that have yet to be updated to the new version
                msg = data.error;
            }
        }
    }

    return {
        type: type,
        payload: {
            message: msg
        },
        error: true
    };
}
