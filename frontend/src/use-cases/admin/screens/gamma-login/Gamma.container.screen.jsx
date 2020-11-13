import {Gamma} from "./Gamma.screen";
import {connect} from "react-redux";
import {authorizeAdmin} from "../../Admin.action-creators";

const mapStateToProps = state => ({
    errorMsg: state.root.AdminReducer.errorMsg
});

const mapDispatchToProps = dispatch => ({
    authorizeAdmin: () => dispatch(authorizeAdmin())
})

export default connect(mapStateToProps, mapDispatchToProps)(Gamma);