import {connect} from "react-redux";

import Admin from "./Admin";
import {onNotAuthorized, verifyAuthorized} from "./Admin.action-creators";

const mapStateToProps = state => ({
    passwordVerified: state.root.PasswordReducer.passwordVerified
});

const mapDispatchToProps = dispatch => ({
    notAuthorized: () => dispatch(onNotAuthorized()),
    isAuthorized: () => dispatch(verifyAuthorized())
});

export default connect(mapStateToProps, mapDispatchToProps)(Admin);
