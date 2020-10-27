import {connect} from "react-redux";
import Meeting from "./Meeting.view";
import {onMeetingSelected, onNewMeeting} from "./Meeting.action-creators.view";

const mapStateToProps = state => ({
    meetings: state.root.MeetingReducer.meetings,
    selectedMeetingID: state.root.MeetingReducer.selectedMeetingID,
    selectedMeeting: state.root.MeetingReducer.selectedMeeting,
    unsavedChangesList: state.root.MeetingReducer.unsavedChangesList
});

const mapDispatchToProps = dispatch => ({
    onMeetingSelected: meeting => dispatch(onMeetingSelected(meeting)),
    onNewMeeting: () => dispatch(onNewMeeting())
});

export default connect(mapStateToProps, mapDispatchToProps)(Meeting);
