export async function authorizedApiCall(call) {
    return call()
        .then(response => {
            return {
                error: false,
                response: response
            }
        })
        .catch(error => {
            const headers = error.response.headers;
            if (error.response.status === 401 && headers.location) {
                window.location.href = headers.location;
            }

            return {
                error: true,
                errResponse: error
            }
        })
}