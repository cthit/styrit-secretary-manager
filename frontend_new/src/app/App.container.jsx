import { connect } from "react-redux";
import { withRouter } from "react-router-dom";
import App from "./App";
import { init } from "./App.action-creator";
import { submitPassword } from "../use-cases/admin/screens/password/Password.action-creator.screen";

const mapStateToProps = state => ({
    debug: state.root.init.debug
});

const mapDispatchToProps = dispatch => ({
    init: () => dispatch(init()),
    helper: pass => dispatch(submitPassword(pass))
});

export default connect(mapStateToProps, mapDispatchToProps)(withRouter(App));
