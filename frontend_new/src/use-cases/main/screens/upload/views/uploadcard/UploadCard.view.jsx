import React from "react";
import { UploadCardButton, UploadCardCard, UploadCardContainer, UploadCardInput } from "./UploadCard.styles";
import { DigitText } from "@cthit/react-digit-components";

export const UploadCard = ({props}) => (
    <UploadCardCard>
        <DigitText.Text text={props.taskName} />
        <UploadCardContainer>
            <UploadCardButton text="" style={{minWidth: "500px"}}>
                <UploadCardInput
                    // ref={el => (state.input = el)}
                    type="file"
                    accept=".pdf, application/pdf"
                    onChange={event => {
                        console.log("Event", event);
                        const file = event.target.files[0];
                        if (file) {
                            if (file.type === "application/pdf") {
                                props.onUpload(file);
                            } else {
                                event.target.value = null;
                                props.onInvalidFiletype(file.type);
                            }
                        }
                    }}
                />
            </UploadCardButton>
        </UploadCardContainer>
    </UploadCardCard>
);

export default UploadCard;
