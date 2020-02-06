import React from "react";
import { DigitTable, DigitSelect } from "@cthit/react-digit-components";
import {
    MeetingContainer,
    MeetingTableContainer,
    MeetingSelectContainer
} from "./Meeting.styles.view";

export const Meeting = props => (
    <MeetingContainer>
        {console.log("SHIELD", props.meetings)}
        <MeetingSelectContainer>
            <DigitSelect
                upperLabel={"Meeting"}
                outlined
                valueToTextMap={getMeetingsMap(props.meetings)}
            />
        </MeetingSelectContainer>
        <MeetingTableContainer>
            <DigitTable />
        </MeetingTableContainer>
    </MeetingContainer>
);

export default Meeting;

function getMeetingsMap(meetings) {
    let meetingsMap = {};
    meetings.forEach(meeting => {
        meetingsMap[meeting.id] = getName(meeting);
    });

    console.log("MEETINGS_MAP::", meetingsMap);
    console.log("MEETINGS::", meetings);
    return meetingsMap;
}

function getName(meeting) {
    let date = new Date(meeting.date);
    return date.getFullYear() + "_LP" + meeting.lp + "_" + meeting.meeting_no;
}
