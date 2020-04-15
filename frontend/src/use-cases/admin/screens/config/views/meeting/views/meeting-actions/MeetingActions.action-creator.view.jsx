import { postMeeting } from "../../../../../../../../api/post.Meting.api";
import { MEETING_SAVE_FAILED, MEETING_SAVE_SUCCESSFUL, WAITING_FOR_RESULT } from "./MeetingActions.actions.view";
import { handleError } from "../../../../../../../../common/functions/handleError";
import { putEmails } from "../../../../../../../../api/put.Emails.api";
import { postDeadline } from "../../../../../../../../api/post.Deadline.api";
import { postArchive } from "../../../../../../../../api/post.Archive.api";

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
    postArchive(meetingID).then(response => {
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

function onMeetingSavedAccepted(response) {
    console.log("RESPONSE::", response);

    // Modify the data here.
    let meeting = response.data;

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
    window.open("http://" + response.data);
}

function onArchiveError(error) {
    alert("Failed to download archive, '" + handleError(error, "").payload.message + "'");
}
