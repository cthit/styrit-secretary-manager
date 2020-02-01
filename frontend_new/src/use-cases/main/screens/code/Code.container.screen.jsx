import { connect } from "react-redux";
import { submitCode } from "./Code.action-creator.screen";

import Code from "./Code.screen";

const mapStateToProps = state => ({
    error: state.root.CodeReducer.error
});

const mapDispatchToProps = dispatch => ({
    submitCode: code => dispatch(submitCode(code))
});

export default connect(mapStateToProps, mapDispatchToProps)(Code);
