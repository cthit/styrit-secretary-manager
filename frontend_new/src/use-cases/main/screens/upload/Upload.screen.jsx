import React from "react";
import UploadCard from "./views/uploadcard";
import { InputGroup, UploadContainer, Space } from "./Upload.styles.screen";
import { DigitText, DigitButton } from "@cthit/react-digit-components";

export const Upload = props => (
    <UploadContainer>
        <InputGroup>
            <DigitText.Heading5 text={"Hej " + props.group.displayName + "!"} />
            <Space />
            {props.tasks.map(task => (
                <UploadCard
                    props={{
                        taskName: task.displayName,
                        onUpload: file => props.onUpload(file, task.codeName),
                        onInvalidFiletype: props.onInvalidFiletype
                    }}
                    key={task.codeName}
                />
            ))}
            {props.error && (
                <DigitText.Text text={props.error} color="error" bold />
            )}
            <DigitButton
                text="Skicka in"
                raised
                primary
                disabled={props.noSubmit}
                onClick={() =>
                    props.submitFiles(
                        props.reports,
                        props.code,
                        props.group.codeName
                    )
                }
            />
        </InputGroup>
    </UploadContainer>
);

export default Upload;
