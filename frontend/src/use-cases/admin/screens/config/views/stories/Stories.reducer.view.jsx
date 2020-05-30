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
            "group": "prit",
            "year": 2020
        },
        {
            "group": "sexit",
            "year": 2017
        },
        {
            "group": "styrit",
            "year": 2017
        },
        {
            "group": "nollkit",
            "year": 2016
        },
        {
            "group": "fanbarerit",
            "year": 2017
        }
    ],
    selectedGroup: null,
    selectedYear: null
};

export const StoriesReducer = (state = initialState, action) => {
    switch (action.type) {
        default:
            return state;
    }
};
