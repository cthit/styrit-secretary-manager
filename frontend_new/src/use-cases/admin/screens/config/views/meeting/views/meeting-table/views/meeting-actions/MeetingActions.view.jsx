import React from "react";
import {
    MeetingActionButton,
    MeetingActionButtonContainer,
    MeetingActionsContainer
} from "./MeetingActions.styles.view.jsx.";
import { DigitText } from "@cthit/react-digit-components";

export const MeetingActions = props => (
    <MeetingActionsContainer>

        {/* MEETING SAVE  */}
        <MeetingActionButtonContainer>
            <MeetingActionButton variant={"contained"} color={"primary"}
                                 onClick={() => props.saveMeeting(props.meeting, props.password)}>
                Save meeting settings
            </MeetingActionButton>
        </MeetingActionButtonContainer>

        {/* MEETING SEND MAIL  */}
        <MeetingActionButtonContainer>
            <DigitText.Text text={"Sends the emails for this meeting (also saves the meeting)"} />
            <MeetingActionButton variant={"contained"} color={"secondary"} disabled>
                Send mails for meeting
            </MeetingActionButton>
        </MeetingActionButtonContainer>

        {/* START DEADLINE CHECK */}
        <MeetingActionButtonContainer>
            <DigitText.Text
                text={"Flags that the deadline for be looked for, when the deadline is over an email will be sent to the board with the archive"} />
            <MeetingActionButton variant={"contained"} color={"secondary"} disabled>
                Send mails for meeting
            </MeetingActionButton>
        </MeetingActionButtonContainer>

        {/* DOWNLOAD MEETING ARCHIVE */}
        <MeetingActionButtonContainer>
            <DigitText.Text
                text={"Download the archive for this meeting (with all documents that have been uploaded currently, also saves the meeting)"} />
            <MeetingActionButton variant={"contained"} color={"primary"} disabled>
                Send mails for meeting
            </MeetingActionButton>
        </MeetingActionButtonContainer>
    </MeetingActionsContainer>
);

export default MeetingActions;