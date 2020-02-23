import { connect } from "react-redux";

import Admin from "./Admin";

const mapStateToProps = state => ({
    meetings: state.root.MeetingReducer.meetings
});

const mapDispatchToProps = dispatch => ({});

export default connect(mapStateToProps, mapDispatchToProps)(Admin);
