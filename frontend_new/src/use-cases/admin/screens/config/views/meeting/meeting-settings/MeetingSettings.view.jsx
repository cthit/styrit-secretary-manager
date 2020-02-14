import React from "react";
import NumbersTextField from "../../../../../../common/elements/NumberTextField";
import { GeneralMeetingInfoGroup } from "./MeetingSettings.styles.view";
import { DigitDateAndTimePicker } from "@cthit/react-digit-components";

export const MeetingSettings = props => {
  const { meeting } = props.meeting;
  return (
    <GeneralMeetingInfoGroup>
      <DigitDateAndTimePicker outlined upperLabel="Date" value={meeting.date} />
      <DigitDateAndTimePicker
        outlined
        upperLabel="Deadline"
        value={meeting.last_upload_date}
      />
z      <GeneralTextFieldContainer>
        <NumbersTextField
          label="Study period"
          value={meeting.study_period}
          onChange={val => console.log("New study period:", val)}
        />
      </GeneralTextFieldContainer>
      <GeneralTextFieldContainer>
        <NumbersTextField
          label="Meeting number"
          value={meeting.meeting_no}
          onChange={val => console.log("New meeting number", val)}
        />
      </GeneralTextFieldContainer>
    </GeneralMeetingInfoGroup>
  );
};

export default MeetingSettings;
