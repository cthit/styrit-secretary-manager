import { connect } from "react-redux";
import Password from "./Password.screen";
import { submitPassword } from "./Password.action-creator.screen";

const mapStateToProps = state => ({
    error: state.root.PasswordReducer.error
});

const mapDispatchToProps = dispatch => ({
    submitPassword: password => dispatch(submitPassword(password))
});

export default connect(mapStateToProps, mapDispatchToProps)(Password);
