import { connect } from "react-redux";
import GeneralMeeting from "./GeneralMeeting.view";
import {
    onMeetingDateUpdated,
    onMeetingLastUploadUpdated,
    onMeetingStudyPeriodUpdated,
    onMeetingNumberUpdated
} from "./GeneralMeeting.action-creators.view";

const mapStateToProps = state => ({
    meeting: state.root.MeetingReducer.selectedMeeting
});

const mapDispatchToProps = dispatch => ({
    onDateUpdated: date => dispatch(onMeetingDateUpdated(date)),
    onDeadlineUpdated: date => dispatch(onMeetingLastUploadUpdated(date)),
    onStudyPeriodUpdated: num => dispatch(onMeetingStudyPeriodUpdated(num)),
    onMeetingNumberUpdated: num => dispatch(onMeetingNumberUpdated(num))
});

export default connect(mapStateToProps, mapDispatchToProps)(GeneralMeeting);
