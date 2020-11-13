import {
    ON_ADD_STORY_GROUP_YEAR,
    ON_CONNECT_STORIES_TO_MEETING_SUCCESSFUL,
    ON_SAVE_STORIES_ERROR,
    ON_SAVE_STORIES_SUCCESSFUL,
    ON_STORIES_MEETING_SELECTED,
    ON_STORY_GROUP_DELETED,
    ON_STORY_GROUP_SELECTED,
    ON_STORY_YEAR_SELECTED
} from "./Stories.actions.view";
import {GET_ADMIN_PAGE_SUCCESSFUL} from "../../../../Admin.actions";
import {
    MEETING_SAVE_SUCCESSFUL,
    SEND_STORY_EMAILS_SUCCESSFUL
} from "../meeting/views/meeting-actions/MeetingActions.actions.view";

const initialState = {
    years: [],
    groupYears: [],
    selectedGroup: undefined,
    selectedYear: undefined,
    errorMsg: "",
    saveError: "",
    unsavedChanges: false,
    groupIds: {
        "A": [{
            group: "styrIT",
            year: "2019",
            id: "aaaa-bbbb-cccc-dddd"
        }]
    },
    meetings: [],
    selectedMeeting: ""
};

export const StoriesReducer = (state = initialState, action) => {
    switch (action.type) {
        case GET_ADMIN_PAGE_SUCCESSFUL:
            return assignState(state, {
                years: action.payload.data.years,
                groupYears: action.payload.data.groupYears,
                unsavedChanges: false,
                meetings: getMeetings(action.payload.data),
                groupIds: action.payload.data.meetingStoryGroups
            })
        case MEETING_SAVE_SUCCESSFUL:
            return handle_meeting_saved(action.payload.meeting, state)
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
        case ON_STORIES_MEETING_SELECTED:
            return assignState(state, {
                selectedMeeting: action.payload.meeting
            })
        case SEND_STORY_EMAILS_SUCCESSFUL:
            return assignState(state, {
                groupIds: action.payload.data
            })
        case ON_CONNECT_STORIES_TO_MEETING_SUCCESSFUL:
            return assignState(state, {
                groupIds: action.payload
            })
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

function getMeetings(data) {
    return Object.keys(data.meetings).map(id => {
        return {
            value: id,
            text: getMeetingName(data.meetings[id])
        }
    });
}

function getMeetingName(meeting) {
    const date = new Date(meeting.date)
    return date.getFullYear() + "_LP" + meeting.lp + "_" + meeting.meeting_no;
}

function handle_meeting_saved(meeting, state) {
    let newMeeting = true;
    const newMeetings = state.meetings.map(m => {
        if (m.value === meeting.id) {
            newMeeting = false;
            return {
                value: meeting.id,
                text: getMeetingName(meeting)
            }
        }
        return m;
    })

    if (newMeeting) {
        newMeetings.push(
            {
                value: meeting.id,
                text: getMeetingName(meeting)
            })
    }

    return assignState(state, {
        meetings: newMeetings
    });
}