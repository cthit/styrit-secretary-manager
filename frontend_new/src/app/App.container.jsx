import { connect } from "react-redux";
import { withRouter } from "react-router-dom";
import App from "./App";
import { init } from "./App.action-creator";

const mapStateToProps = state => ({});

const mapDispatchToProps = dispatch => ({
    init: () => dispatch(init())
});

export default connect(mapStateToProps, mapDispatchToProps)(withRouter(App));
