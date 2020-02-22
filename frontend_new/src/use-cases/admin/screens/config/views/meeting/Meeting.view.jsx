import React from "react";
import {
    DigitSelect,
    DigitButton,
    DigitCheckbox
} from "@cthit/react-digit-components";
import {
    MeetingContainer,
    MeetingSelectContainer,
    NewButtonContainer,
    MeetingConfContainer
} from "./Meeting.styles.view";
import GeneralMeeting from "./views/general-meeting/";
import MeetingTable from "./views/meeting-table";

export const Meeting = props => {
    return (
        <MeetingContainer>
            <MeetingSelectContainer>
                <DigitSelect
                    upperLabel={"Meeting"}
                    outlined
                    valueToTextMap={getMeetingsMap(props.meetings)}
                    onChange={e => {
                        props.onMeetingSelected(e.target.value);
                    }}
                    value={props.selectedMeetingID}
                />
                <NewButtonContainer>
                    <DigitButton text="New Meeting" raised primary />
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
};

export default Meeting;

function getMeetingsMap(meetings) {
    let meetingsMap = {};
    Object.keys(meetings).forEach(key => {
        meetingsMap[key] = getName(meetings[key]);
    });
    return meetingsMap;
}

function getName(meeting) {
    let date = new Date(meeting.date);
    return date.getFullYear() + "_LP" + meeting.lp + "_" + meeting.meeting_no;
}
