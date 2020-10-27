import {connect} from "react-redux";
import General from "./General.view";
import {
    configHelpButtonPressed,
    onConfigChange,
    saveConfig
} from "./General.action-creators.view";

const mapStateToProps = state => ({
    configs: state.root.GeneralReducer.configs,
    password: state.root.PasswordReducer.password,
    selectedConfigIndex: state.root.GeneralReducer.selectedHelpIndex,
    selectedHelp: state.root.GeneralReducer.selectedHelp,
    unsavedChanges: state.root.GeneralReducer.unsavedChanges
});

const mapDispatchToProps = dispatch => ({
        onConfigChange: (key, newVal) => dispatch(onConfigChange(key, newVal)),
        onConfigSave: (password, configs) => dispatch(saveConfig(password, configs)),
        configHelpButtonPressed: index => dispatch(configHelpButtonPressed(index))
    })
;

export default connect(mapStateToProps, mapDispatchToProps)(General);
