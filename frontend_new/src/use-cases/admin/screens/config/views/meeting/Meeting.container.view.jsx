import { connect } from "react-redux";
import Meeting from "./Meeting.view";

const mapStateToProps = state => ({
    meetings: state.root.PasswordReducer.data.meetings
});

const mapDispatchToProps = dispatch => ({});

export default connect(mapStateToProps, mapDispatchToProps)(Meeting);
