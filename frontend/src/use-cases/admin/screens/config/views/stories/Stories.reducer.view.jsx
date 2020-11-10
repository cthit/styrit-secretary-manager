import {
    ON_ADD_STORY_GROUP_YEAR,
    ON_SAVE_STORIES_ERROR,
    ON_SAVE_STORIES_SUCCESSFUL,
    ON_STORY_GROUP_DELETED,
    ON_STORY_GROUP_SELECTED,
    ON_STORY_YEAR_SELECTED
} from "./Stories.actions.view";
import {GET_ADMIN_PAGE_SUCCESSFUL} from "../../../../Admin.actions";

const initialState = {
    years: [],
    groupYears: [],
    selectedGroup: undefined,
    selectedYear: undefined,
    errorMsg: "",
    saveError: "",
    unsavedChanges: false,
    groupIds: [{
        group: "styrIT",
        year: "2019",
        id: "aaaa-bbbb-cccc-dddd"
    }]
};

export const StoriesReducer = (state = initialState, action) => {
    switch (action.type) {
        case GET_ADMIN_PAGE_SUCCESSFUL:
            return assignState(state, {
                years: action.payload.data.years,
                groupYears: action.payload.data.groupYears,
                unsavedChanges: false
            })
        case ON_STORY_GROUP_SELECTED:
            return assignState(state, {
                selectedGroup: action.payload.group
            })
        case ON_STORY_YEAR_SELECTED:
            return assignState(state, {
                selectedYear: action.payload.year
            })
        case ON_SAVE_STORIES_SUCCESSFUL:
            return assignState(state, {
                groupYears: action.payload.groupYears,
                years: action.payload.years,
                unsavedChanges: false
            })
        case ON_SAVE_STORIES_ERROR:
            return assignState(state, {
                saveError: action.payload.message
            })
        case ON_ADD_STORY_GROUP_YEAR:
            return handleAddStoryGroupYear(state)
        case ON_STORY_GROUP_DELETED:
            return handleDeleteStoryGroupYear(state, action.payload.group, action.payload.year)
        default:
            return state;
    }
};

function assignState(state, data = {}) {
    const completeData = Object.assign({}, {
        errorMsg: "",
        saveError: ""
    }, data)

    return Object.assign({}, state, completeData)
}

function handleAddStoryGroupYear(state) {
    // Should be == because it can also be undefined, thus === would not work.
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
                newGroupYears.push(
                    {
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
        return assignState(state, {
            errorMsg: "Group / year already selected!"
        })
    }

    if (!found) {
        newGroupYears.push(
            {
                group: state.selectedGroup,
                year: state.selectedYear,
                finished: false
            })
    }

    return assignState(state, {
        groupYears: newGroupYears,
        unsavedChanges: true
    })
}

function handleDeleteStoryGroupYear(state, group, year) {
    const oldGroupYears = state.groupYears;
    let newGroupYears = []
    oldGroupYears.forEach(groupYear => {
        if (groupYear.group === group && groupYear.year === year) {
            newGroupYears.push(
                {
                    group: group,
                    year: year,
                    finished: true
                })
        } else {
            newGroupYears.push(groupYear)
        }
    })

    return assignState(state, {
        groupYears: newGroupYears,
        unsavedChanges: true
    })
}
