import {connect} from "react-redux";
import MeetingActions from "./MeetingActions.view";
import {
    downloadArchive,
    saveMeeting,
    sendMail,
    sendStoryEmails,
    startDeadlineCheck
} from "./MeetingActions.action-creator.view";

const mapStateToProps = state => ({
    meeting: state.root.MeetingReducer.selectedMeeting,
    groupTasks: state.root.MeetingReducer.groupTasks,
    tasks: state.root.MeetingReducer.tasks,
    errorMsg: state.root.MeetingActionsReducer.errorMsg
});

const mapDispatchToProps = dispatch => ({
    saveMeeting: (meeting, groupTasks, allTasks) => dispatch(saveMeeting(meeting, groupTasks, allTasks)),
    sendEmails: (meetingID) => sendMail(meetingID),
    startDeadlineCheck: (meetingID) => startDeadlineCheck(meetingID),
    downloadArchive: meetingID => downloadArchive(meetingID),
    sendStoryEmails: (meeting) => dispatch(sendStoryEmails(meeting))
});

export default connect(mapStateToProps, mapDispatchToProps)(MeetingActions);
