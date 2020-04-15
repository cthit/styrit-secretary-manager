import { connect } from "react-redux";
import Config from "./Config.screen";
import { onModebuttonClicked } from "./Config.action-creator.screen";

const mapStateToProps = state => ({
    mode: state.root.ConfigReducer.mode
});

const mapDispatchToProps = dispatch => ({
    onModeButtonClicked: mode => dispatch(onModebuttonClicked(mode))
});

export default connect(mapStateToProps, mapDispatchToProps)(Config);
