import React from "react";
import {
    DigitTable,
    DigitSelect,
    DigitDateAndTimePicker,
    DigitButton,
    DigitTextField
} from "@cthit/react-digit-components";
import {
    MeetingContainer,
    MeetingTableContainer,
    MeetingSelectContainer,
    GeneralMeetingInfoGroup,
    NewButtonContainer,
    GeneralInfoContainer,
    GeneralTextFieldContainer
} from "./Meeting.styles.view";
import NumbersTextField from "../../../../../../common/elements/NumberTextField";
export const Meeting = props => {
    const meeting = props.meetings[props.selectedMeeting];
    console.log("ASD", meeting);
    if (meeting) {
        console.log("NUMBER", meeting.meeting_no);
    }
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
                    <GeneralMeetingInfoGroup>
                        <DigitDateAndTimePicker
                            outlined
                            upperLabel="Date"
                            value={meeting.date}
                        />
                        <DigitDateAndTimePicker
                            outlined
                            upperLabel="Deadline"
                            value={meeting.last_upload_date}
                        />
                        <GeneralTextFieldContainer>
                            <NumbersTextField
                                label="Study period"
                                value={meeting.study_period}
                                onChange={val =>
                                    console.log("New study period:", val)
                                }
                            />
                        </GeneralTextFieldContainer>
                        <GeneralTextFieldContainer>
                            <NumbersTextField
                                label="Meeting number"
                                value={meeting.meeting_no}
                                onChange={val =>
                                    console.log("New meeting number", val)
                                }
                            />
                        </GeneralTextFieldContainer>
                    </GeneralMeetingInfoGroup>
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
