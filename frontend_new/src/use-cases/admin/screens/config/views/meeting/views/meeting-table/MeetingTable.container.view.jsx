import { connect } from "react-redux";
import MeetingTable from "./MeetingTable.view";
import { onGroupTaskClicked } from "./MeetingTable.action-creators.view";

const mapStateToProps = state => ({
    groups: state.root.MeetingReducer.groups,
    tasks: state.root.MeetingReducer.tasks,
    tasksMode: state.root.MeetingReducer.taskMode,
    groupTasks: state.root.MeetingReducer.groupTasks
});

const mapDispatchToProps = dispatch => ({
    onGroupTaskClicked: (task, group) =>
        dispatch(onGroupTaskClicked(task, group))
});

export default connect(mapStateToProps, mapDispatchToProps)(MeetingTable);
