import React from "react";
import { GeneralMeetingInfoContainer, GeneralMeetingInfoGroup } from "./GeneralMeeting.styles.view";
import NumbersTextField from "../../../../../../../../common/elements/NumberTextField";
import { DigitDateAndTimePicker } from "@cthit/react-digit-components";

export const GeneralMeeting = props => (
        <GeneralMeetingInfoGroup>
            <GeneralMeetingInfoContainer>
                <DigitDateAndTimePicker upperLabel="Date"
                                        value={formatDate(props.meeting.date)}
                                        outlined
                                        onChange={props.onDateUpdated} />
            </GeneralMeetingInfoContainer>
            <GeneralMeetingInfoContainer>
                <DigitDateAndTimePicker upperLabel="Deadline"
                                        value={formatDate(props.meeting.last_upload_date)}
                                        outlined
                                        onChange={props.onDeadlineUpdated} />
            </GeneralMeetingInfoContainer>
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
    )
;

export default GeneralMeeting;

function formatDate(date) {
    return new Date(date);
}
