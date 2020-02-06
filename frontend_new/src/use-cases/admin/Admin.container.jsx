import { connect } from "react-redux";

import Admin from "./Admin";

const mapStateToProps = state => ({
    data: state.root.PasswordReducer.data
});

const mapDispatchToProps = dispatch => ({});

export default connect(mapStateToProps, mapDispatchToProps)(Admin);
