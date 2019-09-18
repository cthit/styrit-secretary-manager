import React from "react";
import { BodyContainer, InputGroup } from "./Body.styles";
import { TextField, Button, Divider } from "@material-ui/core";
import Upload from "./Upload";

export const Body = () => (
    <BodyContainer className="body-container">
        <InputGroup className="input-group">
            <Upload text="Verksamhetsplan" />
            <Upload text="Verksamhetsrapport" />
            <Upload text="Budget" />
        </InputGroup>

        <Divider />

        <InputGroup>
            <TextField
                label="Code"
                variant="outlined"
                style={{ marginBottom: "20px" }}
            />
            <Button
                color="primary"
                variant="contained"
                style={{ maxHeight: "40px", marginLeft: "10px" }}
            >
                Submit
            </Button>
        </InputGroup>
    </BodyContainer>
);
