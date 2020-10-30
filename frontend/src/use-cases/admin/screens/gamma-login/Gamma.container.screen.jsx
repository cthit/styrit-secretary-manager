import {onLoginWithGamma} from "./Gamma.action-creators.screen";
import {Gamma} from "./Gamma.screen";
import {connect} from "react-redux";

const mapStateToProps = state => ({});

const mapDispatchToProps = dispatch => ({
    loginWithGamma: () => dispatch(onLoginWithGamma())
})

export default connect(mapStateToProps, mapDispatchToProps)(Gamma);