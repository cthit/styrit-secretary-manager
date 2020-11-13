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
import {WAITING_FOR_RESULT} from "../meeting/views/meeting-actions/MeetingActions.actions.view";
import {postStories} from "../../../../../../api/post.Stories.api";
import {handleError} from "../../../../../../common/functions/handleError";
import {authorizedApiCall} from "../../../../../../common/functions/authorizedApiCall";
import {postStoriesConnectMeeting} from "../../../../../../api/post.StoriesConnectMeeting.api";

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

export function saveStories(storyGroups) {
    return dispatch => {
        dispatch({
                     type: WAITING_FOR_RESULT
                 })
        authorizedApiCall(() => postStories(storyGroups))
            .then(response => {
                if (response.error) {
                    dispatch(onStoriesSavedError(response.errResponse));
                } else {
                    dispatch(onStoriesSavedSuccessful(response.response));
                }
            })
            .catch(error => {
                onStoriesSavedError(error);
            });
    };
}

function onStoriesSavedSuccessful(response) {
    // Make sure our data is up to date with the server
    alert("Successfully saved stories!");
    return {
        type: ON_SAVE_STORIES_SUCCESSFUL,
        payload: {
            groupYears: response.data.data.groupYears,
            years: response.data.data.years
        },
        error: false
    };
}

function onStoriesSavedError(error) {
    alert("Failed to save stories");
    return handleError(error, ON_SAVE_STORIES_ERROR);
}

export function onStoriesMeetingSelected(meeting_id) {
    return {
        type: ON_STORIES_MEETING_SELECTED,
        payload: {
            meeting: meeting_id
        },
        error: false
    }
}

export function connectStoriesToMeeting(meetingId) {
    return dispatch => {
        dispatch(
            {
                type: WAITING_FOR_RESULT,
                error: false
            }
        )
        authorizedApiCall(() => postStoriesConnectMeeting(meetingId))
            .then(response => {
                if (response.error) {
                    onConnectStoriesToMeetingFailed(response.errResponse);
                } else {
                    dispatch(onConnectStoriesToMeetingSuccessful(response.response))
                }
            })
            .catch(error => {
                onConnectStoriesToMeetingFailed(error);
            })
    }
}

function onConnectStoriesToMeetingSuccessful(response) {
    alert("Stories connected successfully!");
    return {
        type: ON_CONNECT_STORIES_TO_MEETING_SUCCESSFUL,
        payload: response.data.data,
        error: false
    }
}

function onConnectStoriesToMeetingFailed(error) {
    alert("Failed to connect stories to meeting, error: " + handleError(error, "").payload.message)
}