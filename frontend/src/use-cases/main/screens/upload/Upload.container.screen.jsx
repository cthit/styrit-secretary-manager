import { connect } from "react-redux";
import { onSubmitFiles, onUpload } from "./Upload.action-creator.screen";

import Upload from "./Upload.screen";

function invalidFiletypeDialogData(type) {
    alert("Invalid filetype " + type + "\nOnly pdf files are allowed");
}

const mapStateToProps = state => ({
    group: state.root.CodeReducer.data.group,
    tasks: state.root.CodeReducer.data.tasks,
    error: state.root.UploadReducer.error,
    noSubmit: state.root.UploadReducer.noSubmit,
    reports: state.root.UploadReducer.reports,
    code: state.root.CodeReducer.acceptedCode
});

const mapDispatchToProps = dispatch => ({
    onUpload: (file, task) => dispatch(onUpload(file, task)),
    onInvalidFiletype: type => invalidFiletypeDialogData(type),
    submitFiles: (reports, code, group) =>
        dispatch(onSubmitFiles(reports, code, group))
});

export default connect(mapStateToProps, mapDispatchToProps)(Upload);
