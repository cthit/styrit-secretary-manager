import { connect } from "react-redux";
import MeetingTable from "./MeetingTable.view";

const mapStateToProps = state => ({
    tasks: state.root.PasswordReducer.data.tasks,
    groups: state.root.PasswordReducer.data.groups,
    groups_tasks: state.root.MeetingReducer.selectedMeeting.groups_tasks
});

const mapDispatchToProps = dispatch => ({});

export default connect(mapStateToProps, mapDispatchToProps)(MeetingTable);
