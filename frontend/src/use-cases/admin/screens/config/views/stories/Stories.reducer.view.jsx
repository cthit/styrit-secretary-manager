import {ON_ADD_STORY_GROUP_YEAR, ON_STORY_GROUP_SELECTED, ON_STORY_YEAR_SELECTED} from "./Stories.actions.view";

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
            year: 2020
        },
        {
            group: "sexit",
            year: 2017
        },
        {
            group: "styrit",
            year: 2017
        },
        {
            group: "nollkit",
            year: 2016
        },
        {
            group: "fanbarerit",
            year: 2017
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
        default:
            return state;
    }
};

function handleAddStoryGroupYear(state) {
    // Make sure that this group is not already in the list!
    let exists = false;
    state.groupYears.forEach(groupYear => {
        if (groupYear.group === state.selectedGroup && groupYear.year === state.selectedYear) {
            exists = true;
        }
    })

    if (exists) {
        // The group / year is already in the list.
        return Object.assign({}, state, {
            errorMsg: "Group / year already selected!"
        })
    }

    return Object.assign({}, state, {
            groupYears: [
                ...state.groupYears,
                {
                    group: state.selectedGroup,
                    year: state.selectedYear
                }
            ],
            errorMsg: ""
        }
    )
}
