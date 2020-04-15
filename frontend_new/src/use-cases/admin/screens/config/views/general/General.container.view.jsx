import { connect } from "react-redux";
import General from "./General.view";
import { onConfigChange, saveConfig } from "./General.action-creators.view";

const mapStateToProps = state => ({
    configs: state.root.GeneralReducer.configs,
    password: state.root.PasswordReducer.password
});

const mapDispatchToProps = dispatch => ({
    onConfigChange: (key, newVal) => dispatch(onConfigChange(key, newVal)),
    onConfigSave: (password, configs) => saveConfig(password, configs)
});

export default connect(mapStateToProps, mapDispatchToProps)(General);
