import { connect } from "react-redux";
import General from "./General.view";
import { onConfigChange } from "./General.action-creators.view";

const mapStateToProps = state => ({
    configs: state.root.GeneralReducer.configs
});

const mapDispatchToProps = dispatch => ({
    onConfigChange: (key, newVal) => dispatch(onConfigChange(key, newVal))
});

export default connect(mapStateToProps, mapDispatchToProps)(General);
