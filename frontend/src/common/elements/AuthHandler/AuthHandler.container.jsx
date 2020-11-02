import {connect} from "react-redux";
import {AuthHandler} from "./AuthHandler";
import {postGammaCode} from "./AuthHandler.action-creators";


const mapStateToProps = state => ({
    redirectTo: state.root.AuthHandlerReducer.redirectTo,
    errors: state.root.AuthHandlerReducer.errors
});

const mapDispatchToProps = dispatch => ({
    postGammaCode: code => dispatch(postGammaCode(code))
});

export default connect(mapStateToProps, mapDispatchToProps)(AuthHandler);
