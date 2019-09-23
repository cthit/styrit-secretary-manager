import React from "react";
import { BodyContainer, InputGroup } from "./Body.styles";
import { TextField, Button, Typography, Card } from "@material-ui/core";
import Upload from "./Upload";
import axios from "axios";

const defaultState = {
    code: "",
    acceptedCode: null,
    group: null,
    tasks: {},
    reports: {},
    invalidCode: false
};

export class Body extends React.Component {
    constructor(props) {
        super(props);
        this.state = defaultState;

        this.chooseBody = this.chooseBody.bind(this);
        this.onSubmit = this.onSubmit.bind(this);
        this.onUpload = this.onUpload.bind(this);
        this.onUploadUpdated = this.onUploadUpdated.bind(this);
        this.checkValid = this.checkValid.bind(this);
        this.onError = this.onError.bind(this);
    }

    render() {
        return (
            <BodyContainer className="body-container">
                {this.chooseBody()}
            </BodyContainer>
        );
    }

    chooseBody() {
        if (this.state.acceptedCode === null) {
            return (
                <InputGroup>
                    {this.state.invalidCode && (
                        <Typography variant="h6" color="error">
                            Invalid code
                        </Typography>
                    )}
                    <TextField
                        label="Code"
                        variant="outlined"
                        onChange={event => {
                            const text = event.target.value;
                            this.setState((state, props) => ({
                                code: text
                            }));
                        }}
                        style={{ marginBottom: "20px" }}
                    />
                    <Button
                        color="primary"
                        variant="contained"
                        style={{ maxHeight: "40px", marginLeft: "10px" }}
                        onClick={this.onSubmit}
                    >
                        Submit
                    </Button>
                </InputGroup>
            );
        } else {
            return (
                <InputGroup className="input-group">
                    <Typography variant="h5" style={{ marginBottom: "10px" }}>
                        Hej {this.state.displayGroup}!
                    </Typography>
                    {Object.keys(this.state.tasks).map(task => (
                        <Upload
                            text={this.state.tasks[task].displayName}
                            name={this.state.tasks[task].codeName}
                            onUploadUpdated={this.onUploadUpdated}
                            key={task}
                        />
                    ))}
                    <Button
                        variant="contained"
                        color="primary"
                        style={{ maxHeight: "40px" }}
                        onClick={this.onUpload}
                        disabled={this.checkValid()}
                    >
                        Submit
                    </Button>
                </InputGroup>
            );
        }
    }

    onSubmit() {
        console.log("State", this);
        const data = {
            code: this.state.code
        };

        console.log("data", data);

        axios
            .post("http://localhost:5000/code", data, {})
            .then(res => {
                console.log(res.statusText);

                if (res.data.error) {
                    console.log("Server returned an error: " + res.data.error);
                    this.setState({
                        invalidCode: true
                    });
                } else {
                    this.setState({
                        invalidCode: false
                    });
                    let reports = {};

                    console.log("Response: ", res.data);

                    Object.values(res.data.data.tasks).forEach(task => {
                        reports[task.codeName] = undefined;
                    });

                    this.setState((state, props) => ({
                        acceptedCode: res.data.code,
                        group: res.data.data.group.codeName,
                        displayGroup: res.data.data.group.displayName,
                        tasks: res.data.data.tasks,
                        reports: reports
                    }));

                    console.log("STATE", this.state);
                }
            })
            .catch(error => {
                this.onError(error);
            });
    }

    onUploadUpdated(data) {
        if (data) {
            console.log("DATA", data);

            let oldState = this.state;
            oldState.reports[data.type] = data.file;

            this.setState(oldState);

            console.log("STATE", this.state);
        }
    }

    onUpload() {
        let data = new FormData();
        Object.keys(this.state.reports).map(key => {
            data.append(key, this.state.reports[key]);
        });

        data.append("code", this.state.acceptedCode);
        data.append("group", this.state.group);

        axios
            .put("http://localhost:5000/file", data, {})
            .then(res => {
                console.log(res.statusText);
            })
            .catch(error => {
                this.onError(error);
            });

        this.setState(defaultState);
    }

    checkValid() {
        let reports = this.state.reports;
        let disable = false;
        Object.keys(reports).forEach(key => {
            if (!reports[key]) {
                disable = true;
            }
        });
        return disable;
    }

    onError(error) {
        alert("An error has occured, please try again later! \n" + error);
        console.log(error);
    }
}
