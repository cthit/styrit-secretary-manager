import {connect} from "react-redux";

import Admin from "./Admin";
import {authorizeAdmin} from "./Admin.action-creators";

const mapStateToProps = state => ({
    passwordVerified: state.root.PasswordReducer.passwordVerified
});

const mapDispatchToProps = dispatch => ({
    authorizeAdmin: () => dispatch(authorizeAdmin())
});

export default connect(mapStateToProps, mapDispatchToProps)(Admin);
