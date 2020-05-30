import {
    ON_ADD_STORY_GROUP_YEAR,
    ON_SAVE_STORIES_ERROR,
    ON_SAVE_STORIES_SUCCESSFUL,
    ON_STORY_GROUP_DELETED,
    ON_STORY_GROUP_SELECTED,
    ON_STORY_YEAR_SELECTED
} from "./Stories.actions.view";
import {SUBMIT_PASSWORD_SUCCESSFUL} from "../../../password/Password.actions.screen";

const initialState = {
    years: [],
    groupYears: [],
    selectedGroup: undefined,
    selectedYear: undefined,
    errorMsg: "",
    saveError: ""
};

export const StoriesReducer = (state = initialState, action) => {
    switch (action.type) {
        case SUBMIT_PASSWORD_SUCCESSFUL:
            return Object.assign({}, state, {
                years: action.payload.data.years,
                groupYears: action.payload.data.groupYears,
                errorMsg: "",
                saveError: ""
            })
        case ON_STORY_GROUP_SELECTED:
            return Object.assign({}, state, {
                selectedGroup: action.payload.group,
                errorMsg: "",
                saveError: ""
            })
        case ON_STORY_YEAR_SELECTED:
            return Object.assign({}, state, {
                selectedYear: action.payload.year,
                errorMsg: "",
                saveError: ""
            })
        case ON_SAVE_STORIES_SUCCESSFUL:
            return Object.assign({}, state, {
                groupYears: action.payload.groupYears,
                years: action.payload.years,
                errorMsg: "",
                saveError: ""
            });
        case ON_SAVE_STORIES_ERROR:
            return Object.assign({}, state, {
                errorMsg: "",
                saveError: action.payload.message
            });
        case ON_ADD_STORY_GROUP_YEAR:
            return handleAddStoryGroupYear(state)
        case ON_STORY_GROUP_DELETED:
            return handleDeleteStoryGroupYear(state, action.payload.group, action.payload.year)
        default:
            return state;
    }
};

function handleAddStoryGroupYear(state) {
    // Should be == because it can also be undefined.
    if (state.selectedGroup == null || state.selectedYear == null) {
        return state;
    }

    // Make sure that this group is not already in the list!
    const groupYears = state.groupYears;
    let newGroupYears = [];
    let found = false;
    let finished = true;
    groupYears.forEach(groupYear => {
        if (groupYear.group === state.selectedGroup && groupYear.year === state.selectedYear) {
            found = true;
            if (groupYear.finished) {
                newGroupYears.push({
                    group: groupYear.group,
                    year: groupYear.year,
                    finished: false
                })
            } else {
                finished = false;
            }
        } else {
            newGroupYears.push(groupYear)
        }
    })

    if (found && !finished) {
        // The group / year is already in the list and is not finished.
        return Object.assign({}, state, {
            errorMsg: "Group / year already selected!",
            saveError: ""
        })
    }

    if (!found) {
        newGroupYears.push({
            group: state.selectedGroup,
            year: state.selectedYear,
            finished: false
        })
    }

    return Object.assign({}, state, {
            groupYears: newGroupYears,
            errorMsg: "",
            saveError: ""
        }
    )
}

function handleDeleteStoryGroupYear(state, group, year) {
    const oldGroupYears = state.groupYears;
    let newGroupYears = []
    oldGroupYears.forEach(groupYear => {
        if (groupYear.group === group && groupYear.year === year) {
            newGroupYears.push({
                group: group,
                year: year,
                finished: true
            })
        } else {
            newGroupYears.push(groupYear)
        }
    })

    return Object.assign({}, state, {
        groupYears: newGroupYears,
        errorMsg: "",
        saveError: ""
    })
}
