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
import {putStoryEmails} from "../../../../../../../../api/put.StoryEmails.api";

export function saveMeeting(meeting, groupTasks, allTasks, password) {
    meeting.groups_tasks = getGroupTasksToSend(allTasks, groupTasks);

    return dispatch => {
        dispatch({
                     type: WAITING_FOR_RESULT
                 })
        postMeeting(meeting, password)
            .then(response => {
                dispatch(onMeetingSavedAccepted(response));
            })
            .catch(error => {
                dispatch(onMeetingSavedError(error));
            });
    };
}

export function sendMail(meetingID, password) {
    putEmails(meetingID, password).then(response => {
        onEmailsSentAccepted(response);
    }).catch(error => {
        onEmailsSentError(error);
    })
}

export function startDeadlineCheck(meetingID, password) {
    postDeadline(meetingID, password).then(response => {
        onDeadlineAccepted(response);
    }).catch(error => {
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
            meetingGTs[task].push({
                                      name: group,
                                      code: groupTasks[group].code
                                  })
        })
    })

    return meetingGTs;
}

export function sendStoryEmails(password, meeting) {
    return dispatch => {
        dispatch({
                     type: WAITING_FOR_RESULT
                 })
        putStoryEmails(meeting, password)
            .then(response => {
                dispatch(onSendStoryEmailsSuccessful(response))
            }).catch(error => {
            dispatch(onSendStoryEmailsFailed(error))
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

function onEmailsSentAccepted(response) {
    alert("Mail(s) sent successfully");
}

function onEmailsSentError(error) {
    alert("Failed to send emails, '" + handleError(error, "").payload.message + "'");
}

function onDeadlineAccepted(response) {
    alert("Deadline check started successfully");
}

function onDeadlineError(error) {
    alert("Failed to send start deadlinecheck, '" + handleError(error, "").payload.message + "'");
}

function onArchiveSuccessful(response) {
    console.log("Response???? ", response.data.data);
    window.open("http://" + response.data.data.redirect_url);
}

function onArchiveError(error) {
    alert("Failed to download archive, '" + handleError(error, "").payload.message + "'");
}

function onSendStoryEmailsSuccessful(response) {
    alert("Send story emails successful!");
    return {
        type: SEND_STORY_EMAILS_SUCCESSFUL,
        payload: {},
        error: false
    }
}

function onSendStoryEmailsFailed(error) {
    alert("Failed sending emails for stories")
    return handleError(error, SEND_STORY_EMAILS_FAILED)
}

