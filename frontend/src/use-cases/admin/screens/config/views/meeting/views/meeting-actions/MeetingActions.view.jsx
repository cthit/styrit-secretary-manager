import React from "react";
import {
    MeetingActionButton,
    MeetingActionButtonContainer,
    MeetingActionsContainer
} from "./MeetingActions.styles.view.jsx.";
import {DigitText, useDigitDialog} from "@cthit/react-digit-components";

export const MeetingActions = props => {
    const [openSendMailDialog] = useDigitDialog({
        title: "Are you sure you want to send the mail(s)?",
        confirmButtonText: "Yes",
        cancelButtonText: "No",
        onConfirm: () => {
        },
        onCancel: () => {
        }
    })
    const [openStartDeadlineCheck] = useDigitDialog({
        title: "Are you sure you want to start the deadline check for this meeting?",
        confirmButtonText: "Yes",
        cancelButtonText: "No",
        onConfirm: () => {
        },
        onCancel: () => {
        }
    })

    return (
        <MeetingActionsContainer>

            {/* MEETING SAVE  */}
            <MeetingActionButtonContainer>
                {props.errorMsg !== "" && <DigitText.Text bold text={props.errorMsg} color={"error"} />}
                <DigitText.Text text={"Saves the settings for the selected meeting"} />
                <MeetingActionButton variant={"contained"} color={"primary"}
                                     onClick={() => props.saveMeeting(props.meeting, props.groupTasks, props.tasks, props.password)}>
                    Save meeting settings
                </MeetingActionButton>
            </MeetingActionButtonContainer>

            {/* MEETING SEND MAIL  */}
            <MeetingActionButtonContainer>
                <DigitText.Text text={"Sends the emails for this meeting"} />
                <MeetingActionButton variant={"contained"} color={"secondary"}
                                     onClick={() => {
                                         openSendMailDialog({
                                                 description: "Don't forget to save before sending the mail(s)!",
                                                 onConfirm: () => {
                                                     props.sendEmails(props.meeting.id, props.password)
                                                 }
                                             }
                                         )
                                     }}>
                    Send mails for meeting
                </MeetingActionButton>
            </MeetingActionButtonContainer>

            {/* STORIES SEND MAIL */}
            <MeetingActionButtonContainer>
                <DigitText.Text
                    text={"Sends the emails to collect the stories for this meeting (see history config)"} />
                <MeetingActionButton variant={"contained"} color={"secondary"}
                                     onClick={() => openSendMailDialog({
                                         title: "Are you sure you want to send the story email(s)?",
                                         description: "Don't forget to save (on the history config!) before sending the mail(s)!",
                                         onConfirm: () => props.sendStoryEmails(props.meeting.id, props.password)
                                     })}>
                    Send emails to story groups (see history page)
                </MeetingActionButton>

            </MeetingActionButtonContainer>

            {/* START DEADLINE CHECK */}
            <MeetingActionButtonContainer>
                <DigitText.Text
                    text={"Flags that the deadline should be checked for, when the deadline is met an email will be sent to the board with the archive"} />
                <MeetingActionButton variant={"contained"} color={"secondary"}
                                     onClick={() => openStartDeadlineCheck({
                                         onConfirm: () => {
                                             props.startDeadlineCheck(props.meeting.id, props.password)
                                         }
                                     })}>
                    Start deadline check
                </MeetingActionButton>
            </MeetingActionButtonContainer>

            {/* DOWNLOAD MEETING ARCHIVE */}
            <MeetingActionButtonContainer>
                <DigitText.Text
                    text={"Download the archive for this meeting (with all documents that have been uploaded currently)"} />
                <MeetingActionButton variant={"contained"} color={"primary"}
                                     onClick={() => props.downloadArchive(props.meeting.id)}>
                    Download archive
                </MeetingActionButton>
            </MeetingActionButtonContainer>
        </MeetingActionsContainer>
    )
};

export default MeetingActions;