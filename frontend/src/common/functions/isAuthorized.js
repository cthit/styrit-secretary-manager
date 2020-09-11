// Used to check if it is even worth to send request to the backend or if the
// user should be notified that it lacks the proper authentication
export function isVerified(gammaMe) {
    if (gammaMe && gammaMe.groups) {
        gammaMe.groups.forEach(group => {
            if (group.active && group.superGroup.name === "styrit") {
                return true;
            }
        })
    }

    return false;
}