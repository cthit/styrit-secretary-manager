import {postRequest} from "./RequestUtilities";

export function postStories(storyGroups) {
    let data = {
        storyGroups: storyGroups
    }

    return postRequest("/admin/config/stories/add", data);
}
