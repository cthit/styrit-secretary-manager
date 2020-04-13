import { connect } from "react-redux";
import MeetingActions from "./MeetingActions.view";
import { saveMeeting } from "./MeetingActions.action-creator.view";

const mapStateToProps = state => ({
    meeting: state.root.MeetingReducer.selectedMeeting,
    password: state.root.PasswordReducer.password
});

const mapDispatchToProps = dispatch => ({
    saveMeeting: (meeting, password) => dispatch(saveMeeting(meeting, password))
});

export default connect(mapStateToProps, mapDispatchToProps)(MeetingActions);
