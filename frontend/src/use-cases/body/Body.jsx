import React from "react"
import { BodyContainer, InputGroup, UploadGroup } from "./Body.styles";
import { TextField, Button, Divider } from "@material-ui/core"
import Upload from "./Upload";

export const Body = () => (
    <BodyContainer>

        <InputGroup>
            <Upload text="Verksamhetsplan"/>
            <Upload text="Verksamhetsrapport" />
            <Upload text="Budget" />
        </InputGroup>

        <Divider />
        
        <InputGroup>
            <TextField label="Code" variant="outlined" style={{marginRight: "10px"}}/>
            <Button color="primary" variant="contained" style={{maxHeight: "40px", marginLeft: "10px"}}> Submit </Button>
        </InputGroup>
        
    </BodyContainer>
);