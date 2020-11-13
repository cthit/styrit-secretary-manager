import {postMeeting} from "../../../../../../../../api/post.Meting.api";
import {
    MEETING_SAVE_FAILED,
    MEETING_SAVE_SUCCESSFUL,
    SEND_STORY_EMAILS_FAILED,
    SEND_STORY_EMAILS_SUCCESSFUL,
    WAITING_FOR_RESULT
} from "./MeetingActions.actions.view";
import {handleError} from "../../../../../../../../common/functions/handleError";
import {putEmails} from "../../../../../../../../api/put.Emails.api";
import {postDeadline} from "../../../../../../../../api/post.Deadline.api";
import {getArchiveUrl} from "../../../../../../../../api/get.ArchiveUrl.api";
import {authorizedApiCall} from "../../../../../../../../common/functions/authorizedApiCall";
import {putStoryEmails} from "../../../../../../../../api/put.StoryEmails.api";

export function saveMeeting(meeting, groupTasks, allTasks) {
    meeting.groups_tasks = getGroupTasksToSend(allTasks, groupTasks);

    return dispatch => {
        dispatch({
                     type: WAITING_FOR_RESULT
                 })
        authorizedApiCall(() => postMeeting(meeting))
            .then(response => {
                if (response.error) {
                    dispatch(onMeetingSavedError(response.errResponse));
                } else {
                    dispatch(onMeetingSavedAccepted(response.response));
                }
            })
            .catch(error => {
                dispatch(onMeetingSavedError(error));
            })
    };
}

export function sendMail(meetingID) {
    authorizedApiCall(() => putEmails(meetingID))
        .then(response => {
            if (response.error) {
                onMeetingSavedAccepted(response.response);
            } else {
                onMeetingSavedError(response.error);
            }
        })
        .catch(error => {
            onMeetingSavedError(error);
        })
}

export function startDeadlineCheck(meetingID) {
    authorizedApiCall(() => postDeadline(meetingID))
        .then(response => {
            if (response.error) {
                onDeadlineError(response.errResponse);
            } else {
                onDeadlineAccepted(response.response);
            }
        })
        .catch(error => {
            onDeadlineError(error);
        })
}

export function downloadArchive(meetingID) {
    getArchiveUrl(meetingID).then(response => {
        onArchiveSuccessful(response);
    }).catch(error => {
        onArchiveError(error);
    })
}

function getGroupTasksToSend(allTasks, groupTasks) {
    let meetingGTs = {}
    Object.keys(allTasks).forEach(task => {
        meetingGTs[task] = [];
    })

    Object.keys(groupTasks).forEach(group => {
        groupTasks[group].tasks.forEach(task => {
            meetingGTs[task].push(
                {
                    name: group,
                    code: groupTasks[group].code
                }
            )
        })
    })

    return meetingGTs;
}

export function sendStoryEmails(meeting) {
    return dispatch => {
        dispatch(
            {
                type: WAITING_FOR_RESULT
            }
        )
        authorizedApiCall(() => putStoryEmails(meeting))
            .then(response => {
                if (response.error) {
                    dispatch(onSendStoryEmailsFailed(response.errResponse));
                } else {
                    dispatch(onSendStoryEmailsSuccessful(response.response))
                }
            })
            .catch(error => {
                dispatch(onSendStoryEmailsFailed(error));
            })
    }
}

function onMeetingSavedAccepted(response) {

    // Modify the data here.
    let meeting = response.data.data;

    return {
        type: MEETING_SAVE_SUCCESSFUL,
        payload: {
            meeting: meeting
        },
        error: false
    };
}

function onMeetingSavedError(error) {
    return handleError(error, MEETING_SAVE_FAILED);
}

function onDeadlineAccepted(response) {
    alert("Deadline check started successfully");
}

function onDeadlineError(error) {
    alert("Failed to send start deadlinecheck, '" + handleError(error, "").payload.message + "'");
}

function onArchiveSuccessful(response) {
    window.open("http://" + response.data.data.redirect_url);
}

function onArchiveError(error) {
    alert("Failed to download archive, '" + handleError(error, "").payload.message + "'");
}

function onSendStoryEmailsSuccessful(response) {
    alert("Send story emails successful!");
    return {
        type: SEND_STORY_EMAILS_SUCCESSFUL,
        payload: response.data,
        error: false
    }
}

function onSendStoryEmailsFailed(error) {
    alert("Failed sending emails for stories")
    return handleError(error, SEND_STORY_EMAILS_FAILED)
}

