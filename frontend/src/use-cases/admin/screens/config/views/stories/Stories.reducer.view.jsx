import {
    ON_ADD_STORY_GROUP_YEAR,
    ON_STORY_GROUP_DELETED,
    ON_STORY_GROUP_SELECTED,
    ON_STORY_YEAR_SELECTED
} from "./Stories.actions.view";

const initialState = {
    years: [
        2020,
        2019,
        2018,
        2017,
        2016
    ],
    groupYears: [
        {
            group: "prit",
            year: 2020,
            finished: false
        },
        {
            group: "sexit",
            year: 2017,
            finished: false
        },
        {
            group: "styrit",
            year: 2017,
            finished: false
        },
        {
            group: "nollkit",
            year: 2016,
            finished: true
        },
        {
            group: "fanbarerit",
            year: 2017,
            finished: true
        }
    ],
    selectedGroup: null,
    selectedYear: null,
    errorMsg: null
};

export const StoriesReducer = (state = initialState, action) => {
    switch (action.type) {
        case ON_STORY_GROUP_SELECTED:
            return Object.assign({}, state, {
                selectedGroup: action.payload.group,
                errorMsg: ""
            })
        case ON_STORY_YEAR_SELECTED:
            return Object.assign({}, state, {
                selectedYear: action.payload.year,
                errorMsg: ""
            })
        case ON_ADD_STORY_GROUP_YEAR:
            return handleAddStoryGroupYear(state)
        case ON_STORY_GROUP_DELETED:
            return handleDeleteStoryGroupYear(state, action.payload.group, action.payload.year)
        default:
            return state;
    }
};

function handleAddStoryGroupYear(state) {
    if (state.selectedGroup === null || state.selectedYear === null) {
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
            errorMsg: "Group / year already selected!"
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
            errorMsg: ""
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
        groupYears: newGroupYears
    })
}
