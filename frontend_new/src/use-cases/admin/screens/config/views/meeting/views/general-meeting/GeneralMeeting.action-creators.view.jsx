import {
    MEETING_DATE_UPDATED,
    MEETING_LAST_UPLOAD_UPDATED,
    MEETING_NUMBER_UPDATED,
    MEETING_STUDY_PERIOD_UPDATED
} from "./GeneralMeeting.actions.view";

export function onMeetingDateUpdated(newDate) {
    let date = newDate.toISOString();

    return dispatch =>
        dispatch({
            type: MEETING_DATE_UPDATED,
            payload: {
                date: date
            },
            error: false
        });
}

export function onMeetingLastUploadUpdated(newDate) {
    let date = newDate.toISOString();
    return dispatch =>
        dispatch({
            type: MEETING_LAST_UPLOAD_UPDATED,
            payload: {
                date: date
            },
            error: false
        });
}

export function onMeetingStudyPeriodUpdated(num) {
    if (isNaN(num) || num < 0) {
        num = 0;
    }

    if (num > 999) {
        num = 999;
    }

    return dispatch =>
        dispatch({
            type: MEETING_STUDY_PERIOD_UPDATED,
            payload: {
                study_period: num
            },
            error: false
        });
}

export function onMeetingNumberUpdated(num) {
    if (isNaN(num) || num < 0) {
        num = 0;
    }

    if (num > 999) {
        num = 999;
    }

    return dispatch =>
        dispatch({
            type: MEETING_NUMBER_UPDATED,
            payload: {
                meeting_no: num
            },
            error: false
        });
}
