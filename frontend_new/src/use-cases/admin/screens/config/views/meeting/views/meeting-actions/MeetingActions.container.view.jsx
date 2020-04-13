import { connect } from "react-redux";
import MeetingActions from "./MeetingActions.view";
import { saveMeeting } from "./MeetingActions.action-creator.view";

const mapStateToProps = state => ({
    meeting: state.root.MeetingReducer.selectedMeeting,
    groupTasks: state.root.MeetingReducer.groupTasks,
    tasks: state.root.MeetingReducer.tasks,
    password: state.root.PasswordReducer.password,
    errorMsg: state.root.MeetingActionsReducer.errorMsg
});

const mapDispatchToProps = dispatch => ({
    saveMeeting: (meeting, groupTasks, allTasks, password) => dispatch(saveMeeting(meeting, groupTasks, allTasks, password))
});

export default connect(mapStateToProps, mapDispatchToProps)(MeetingActions);
