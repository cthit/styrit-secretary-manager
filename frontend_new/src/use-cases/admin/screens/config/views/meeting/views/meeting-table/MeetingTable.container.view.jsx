import { connect } from "react-redux";
import MeetingTable from "./MeetingTable.view";
import { onGroupTaskClicked } from "./MeetingTable.action-creators.view";

const mapStateToProps = state => ({
    tasks: state.root.MeetingReducer.tasks,
    groups: state.root.MeetingReducer.groupCodes,
    groups_tasks: state.root.MeetingReducer.selectedMeeting.groups_tasks
});

const mapDispatchToProps = dispatch => ({
    onGroupTaskClicked: (task, group) =>
        dispatch(onGroupTaskClicked(task, group))
});

export default connect(mapStateToProps, mapDispatchToProps)(MeetingTable);
