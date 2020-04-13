import { postMeeting } from "../../../../../../../../api/post.Meting.api";
import { MEETING_SAVE_FAILED, MEETING_SAVE_SUCCESSFUL } from "./MeetingActions.actions.view";
import { handleError } from "../../../../../../../../common/functions/handleError";
import { putEmails } from "../../../../../../../../api/put.Emails.api";

export function saveMeeting(meeting, groupTasks, allTasks, password) {
    meeting.groups_tasks = getGroupTasksToSend(allTasks, groupTasks);

    return dispatch => {
        postMeeting(meeting, password)
            .then(response => {
                return dispatch(onMeetingSavedAccepted(response));
            })
            .catch(error => {
                return dispatch(onMeetingSavedError(error));
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
    alert("Failed to send emails error message '" + handleError(error, "").payload.message + "'");
}