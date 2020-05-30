import {postRequest} from "./RequestUtilities";

export function postStories(storyGroups, password) {
    let data = {
        pass: password,
        storyGroups: storyGroups
    }

    return postRequest("/admin/config/stories", data, false);
}
