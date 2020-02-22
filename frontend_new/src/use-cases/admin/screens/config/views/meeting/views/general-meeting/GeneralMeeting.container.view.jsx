import { connect } from "react-redux";
import GeneralMeeting from "./GeneralMeeting.view";

const mapStateToProps = state => ({
    meeting: state.root.MeetingReducer.selectedMeeting
});

const mapDispatchToProps = dispatch => ({});

export default connect(mapStateToProps, mapDispatchToProps)(GeneralMeeting);
