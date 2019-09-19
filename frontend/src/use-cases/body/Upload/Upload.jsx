import React from "react";

import "filepond/dist/filepond.min.css";
import { UploadContainer } from "./Upload.styles";
import { Card, Typography, Button } from "@material-ui/core";

const state = {
    file: null,
    input: null
};

const UploadSnippet = ({ props }) => (
    <div
        style={{
            display: "flex",
            flexDirection: "row",
            justifyContent: "center"
        }}
    >
        <Button
            style={{
                border: "2px solid #909090",
                backgroundColor: "#D0D0D0"
            }}
        >
            <input
                ref={el => (state.input = el)}
                type="file"
                accept=".pdf, application/pdf"
                style={{
                    height: "60px",
                    width: "500px"
                }}
                onChange={event => {
                    onUpload(event, props);
                    console.log("State: ", state);
                }}
            />
        </Button>
    </div>
);

export const Upload = props => (
    <Card
        style={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            paddingTop: "20px",
            marginRight: "20px",
            marginBottom: "20px"
        }}
    >
        <Typography fontWeight={800} fontSize="h1.fontSize">
            {props.text}
        </Typography>
        <UploadContainer>
            <UploadSnippet props={props} />
        </UploadContainer>
    </Card>
);

function resetState(event) {
    state.file = null;
    event.target.value = null;
}

function onUpload(event, props) {
    const file = event.target.files[0];
    if (file) {
        if (file.type === "application/pdf") {
            console.log("Accepting file:", file);
            console.log("PROPS", props);

            props.onUploadUpdated({
                type: props.name,
                file: file
            });
        } else {
            console.log("Do not accept filetype: " + file.type);
            resetState(event);
        }
    } else {
        resetState(event);
    }
}
