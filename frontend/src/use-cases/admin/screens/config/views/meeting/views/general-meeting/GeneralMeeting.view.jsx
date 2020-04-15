import React from "react";
import { GeneralMeetingInfoContainer, GeneralMeetingInfoGroup } from "./GeneralMeeting.styles.view";
import NumbersTextField from "../../../../../../../../common/elements/NumberTextField";
import { DateTimePicker, MuiPickersUtilsProvider } from "@material-ui/pickers";
import DateFnsUtils from "@date-io/date-fns"; // choose your lib

export const GeneralMeeting = props => (
    <GeneralMeetingInfoGroup>
        <MuiPickersUtilsProvider utils={DateFnsUtils}>
            <GeneralMeetingInfoContainer>
                <DateTimePicker
                    autoOk
                    ampm={false}
                    inputVariant="outlined"
                    label="Date"
                    value={formatDate(props.meeting.date)}
                    onChange={props.onDateUpdated}
                    format="dd/MM/yyyy HH:mm"
                />
            </GeneralMeetingInfoContainer>
            <GeneralMeetingInfoContainer>
                <DateTimePicker
                    autoOk
                    ampm={false}
                    inputVariant="outlined"
                    label="Deadline"
                    value={formatDate(props.meeting.last_upload_date)}
                    onChange={props.onDeadlineUpdated}
                    format="dd/MM/yyyy HH:mm"
                />
            </GeneralMeetingInfoContainer>
        </MuiPickersUtilsProvider>
        <GeneralMeetingInfoContainer>
            <NumbersTextField
                label="Study period"
                value={props.meeting.lp}
                onChange={props.onStudyPeriodUpdated}
            />
        </GeneralMeetingInfoContainer>
        <GeneralMeetingInfoContainer>
            <NumbersTextField
                label="Meeting number"
                value={props.meeting.meeting_no}
                onChange={props.onMeetingNumberUpdated}
            />
        </GeneralMeetingInfoContainer>
    </GeneralMeetingInfoGroup>
);

export default GeneralMeeting;

function formatDate(date) {
    let dateD = new Date(date);
    return dateD.toISOString();
}
