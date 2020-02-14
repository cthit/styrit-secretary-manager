import React from "react";
import {
  DigitTable,
  DigitSelect,
  DigitButton
} from "@cthit/react-digit-components";
import {
  MeetingContainer,
  MeetingTableContainer,
  MeetingSelectContainer,
  NewButtonContainer
} from "./Meeting.styles.view";
import MeetingSettings from "./meeting-settings/MeetingSettings.view";

export const Meeting = props => {
  const meeting = props.meetings[props.selectedMeeting];
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
          value={props.selectedMeeting}
        />
        <NewButtonContainer>
          <DigitButton text="New Meeting" raised primary />
        </NewButtonContainer>
      </MeetingSelectContainer>
      {props.selectedMeeting && (
        <div>
          <MeetingSettings />
          {/* <MeetingTableContainer>
                        <DigitTable />
                    </MeetingTableContainer> */}
        </div>
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
