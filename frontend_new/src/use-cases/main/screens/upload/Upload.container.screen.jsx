import { connect } from "react-redux";
import { onUpload } from "./Uploads.action-creator.screen";

import Upload from "./Upload.screen";
import { DigitDialogActions } from "@cthit/react-digit-components";

function invalidFiletypeDialogData(type) {
    return {
        title: "Invalid filetype " + type,
        description: "Only pdf files are allowed",
        confirmButtonText: "Ok",
        cancelButtonText: ""
    };
}

const dispatchDialog = (dialogData, dispatch) =>
    dispatch(DigitDialogActions.digitDialogOpen(dialogData));

const mapStateToProps = state => ({
    groupName: state.root.CodeReducer.data.group.displayName,
    tasks: state.root.CodeReducer.data.tasks,
    error: state.root.UploadReducer.error
});

const mapDispatchToProps = dispatch => ({
    onUpload: (file, task) => dispatch(onUpload(file, task)),
    onInvalidFiletype: type =>
        dispatchDialog(invalidFiletypeDialogData(type), dispatch)
});

export default connect(mapStateToProps, mapDispatchToProps)(Upload);
