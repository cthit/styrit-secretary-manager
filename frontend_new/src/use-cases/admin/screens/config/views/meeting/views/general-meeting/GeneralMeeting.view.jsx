import React from "react";
import {
    GeneralTextFieldContainer,
    GeneralInfoContainer,
    GeneralMeetingInfoGroup,
    GeneralMeetingInfoContainer
} from "./GeneralMeeting.styles.view";
import NumbersTextField from "../../../../../../../../common/elements/NumberTextField";
import { DateTimePicker, MuiPickersUtilsProvider } from "@material-ui/pickers";
import DateFnsUtils from "@date-io/date-fns"; // choose your lib

export const GeneralMeeting = props => {
    const meeting = props.meeting;
    const date = formatDate(meeting.date);
    const last_upload = formatDate(meeting.last_upload_date);

    return (
        <GeneralMeetingInfoGroup>
            <MuiPickersUtilsProvider utils={DateFnsUtils}>
                <GeneralMeetingInfoContainer>
                    <DateTimePicker
                        autoOk
                        ampm={false}
                        inputVariant="outlined"
                        label="Date"
                        value={date}
                        onChange={event => {
                            console.log("NEW DATE", event);
                        }}
                        format="dd/MM/yyyy HH:mm"
                    />
                </GeneralMeetingInfoContainer>
                <GeneralMeetingInfoContainer>
                    <DateTimePicker
                        autoOk
                        ampm={false}
                        inputVariant="outlined"
                        label="Deadline"
                        value={last_upload}
                        onChange={event => {
                            console.log("NEW LAST_UPLOAD", event);
                        }}
                        format="dd/MM/yyyy HH:mm"
                    />
                </GeneralMeetingInfoContainer>
            </MuiPickersUtilsProvider>
            <GeneralMeetingInfoContainer>
                <NumbersTextField
                    label="Study period"
                    value={meeting.lp}
                    onChange={val => console.log("New study period:", val)}
                />
            </GeneralMeetingInfoContainer>
            <GeneralMeetingInfoContainer>
                <NumbersTextField
                    label="Meeting number"
                    value={meeting.meeting_no}
                    onChange={val => console.log("New meeting number", val)}
                />
            </GeneralMeetingInfoContainer>
        </GeneralMeetingInfoGroup>
    );
};

export default GeneralMeeting;

function formatDate(date) {
    let dateD = new Date(date);
    return dateD.toISOString();
}
