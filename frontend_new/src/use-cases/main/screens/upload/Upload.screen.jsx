import React from "react";
import UploadCard from "./views/uploadcard";
import { InputGroup, UploadContainer, Space } from "./Upload.styles.screen";
import { DigitText } from "@cthit/react-digit-components";

export const Upload = props => (
    <UploadContainer>
        <InputGroup>
            <DigitText.Heading5 text={"Hej " + props.groupName + "!"} />
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
        </InputGroup>
    </UploadContainer>
);

export default Upload;
