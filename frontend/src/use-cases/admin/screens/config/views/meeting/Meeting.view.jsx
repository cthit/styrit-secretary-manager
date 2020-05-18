import React from "react";
import {
    MeetingConfContainer,
    MeetingContainer,
    MeetingSelectContainer,
    NewButtonContainer
} from "./Meeting.styles.view";
import GeneralMeeting from "./views/general-meeting/";
import MeetingTable from "./views/meeting-table";
import { Button } from "@material-ui/core";
import { DigitAutocompleteSelectSingle } from "@cthit/react-digit-components";

export const Meeting = props => (
    <MeetingContainer>
        <MeetingSelectContainer>
            <DigitAutocompleteSelectSingle
                upperLabel={"Meeting"}
                outlined
                options={getMeetingSelectArray(props.meetings)}
                onChange={e => {
                    props.onMeetingSelected(e.target.value);
                }}
                value={props.selectedMeetingID}
                disabled={!props.meetings || Object.keys(props.meetings).length === 0}
                noOptionsText={"Create a meeting"}
            />
            <NewButtonContainer>
                {/* text="New Meeting" raised primary /> */}
                <Button variant="contained" color="primary" onClick={props.onNewMeeting}>
                    New Meeting
                </Button>
            </NewButtonContainer>
        </MeetingSelectContainer>
        {props.selectedMeeting && (
            <MeetingConfContainer>
                <GeneralMeeting />
                <MeetingTable />
            </MeetingConfContainer>
        )}
    </MeetingContainer>
);

export default Meeting;

function getMeetingSelectArray(meetings) {
    let meetingArr = [];
    Object.keys(meetings).forEach(id => {
        meetingArr.push({
            text: getName(meetings[id]),
            value: id
        })
    })
    return meetingArr;
}

function getName(meeting) {
    let date = new Date(meeting.date);
    return date.getFullYear() + "_LP" + meeting.lp + "_" + meeting.meeting_no;
}
