import React from "react"

import { FilePond } from "react-filepond";
import "filepond/dist/filepond.min.css";
import { UploadContainer } from "./Upload.styles";
import {Card, Typography} from "@material-ui/core"

export const Upload = (props) => (
    <Card style={{display: "flex", flexDirection: "column", alignItems: "center", paddingTop: "20px", marginRight: "20px"}}>
        <Typography textAlign="center" fontWeight={800} fontSize="h1.fontSize">
            {props.text}
        </Typography>
        <UploadContainer>
            <FilePond
                files={null}
                allowMultiple={false}
                onupdatefiles={console.log("File updated")}
                labelIdle='Drag & Drop your files or <span class="filepond--label-action">Browse</span>'
            />
        </UploadContainer>
    </Card>
)