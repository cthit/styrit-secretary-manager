import {
    ON_ADD_STORY_GROUP_YEAR,
    ON_STORY_GROUP_DELETED,
    ON_STORY_GROUP_SELECTED,
    ON_STORY_YEAR_SELECTED
} from "./Stories.actions.view";

export function selectedStoryGroup(group) {
    return {
        type: ON_STORY_GROUP_SELECTED,
        payload: {
            group: group
        },
        error: false
    }
}

export function selectedStoryYear(year) {
    return {
        type: ON_STORY_YEAR_SELECTED,
        payload: {
            year: year
        },
        error: false
    }
}

export function addStoryGroupYear() {
    return {
        type: ON_ADD_STORY_GROUP_YEAR,
        payload: {},
        error: false
    }
}

export function deleteStoryGroupYear(groupYear) {
    const group = groupYear.group.name;
    const year = groupYear.year;
    
    return {
        type: ON_STORY_GROUP_DELETED,
        payload: {
            group: group,
            year: year
        },
        error: false
    }
}