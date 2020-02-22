import { connect } from "react-redux";
import Meeting from "./Meeting.view";
import { onMeetingSelected } from "./Meeting.action-creators.view";

const mapStateToProps = state => ({
    meetings: state.root.PasswordReducer.data.meetings,
    selectedMeetingID: state.root.MeetingReducer.selectedMeetingID,
    selectedMeeting: state.root.MeetingReducer.selectedMeeting
});

const mapDispatchToProps = dispatch => ({
    onMeetingSelected: meeting => dispatch(onMeetingSelected(meeting))
});

export default connect(mapStateToProps, mapDispatchToProps)(Meeting);
