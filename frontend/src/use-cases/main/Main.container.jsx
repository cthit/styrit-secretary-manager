import { connect } from "react-redux";

import Main from "./Main";

const mapStateToProps = state => ({
    acceptedCode: state.root.CodeReducer.acceptedCode
});

const mapDispatchToProps = dispatch => ({});

export default connect(mapStateToProps, mapDispatchToProps)(Main);
