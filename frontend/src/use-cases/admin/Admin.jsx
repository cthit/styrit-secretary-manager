import React from "react";
import {
    TextField,
    Button,
    Typography,
    Card,
    Divider
} from "@material-ui/core";
import InputGroup from "../../common-ui/InputGroup";
import axios from "axios";
import { ConfigGrid, ConfigContainer, StyledTextField } from "./Admin.styles";
import Meetings from "./ConfigPages/Meetings";

const defaultState = {
    password: "",
    acceptedPassword: null,
    errorMsg: "",
    configList: []
};

export class Admin extends React.Component {
    constructor(props) {
        super(props);
        this.state = defaultState;

        this.chooseBody = this.chooseBody.bind(this);
        this.onSubmit = this.onSubmit.bind(this);
        this.onError = this.onError.bind(this);
        this.handleChange = this.handleChange.bind(this);
        this.onSave = this.onSave.bind(this);
    }

    render() {
        return <div className="body-container">{this.chooseBody()}</div>;
    }

    chooseBody() {
        if (this.state.acceptedPassword === null) {
            return (
                <InputGroup>
                    {this.state.errorMsg !== "" && (
                        <Typography
                            style={{
                                textAlign: "center",
                                maxWidth: "400px"
                            }}
                            variant="h6"
                            color="error"
                        >
                            {this.state.errorMsg}
                        </Typography>
                    )}
                    <Card
                        style={{
                            margin: "20px",
                            padding: "10px",
                            backgroundColor: "orange",
                            minWidth: "300px",
                            display: "flex",
                            minHeight: "30px",
                            justifyContent: "center",
                            alignItems: "center"
                        }}
                    >
                        <Typography>
                            Inloggning för sekreterare endast!
                        </Typography>
                    </Card>
                    <TextField
                        label="Lösenord"
                        variant="outlined"
                        onChange={event => {
                            const text = event.target.value;
                            this.setState((state, props) => ({
                                password: text
                            }));
                        }}
                        style={{ marginBottom: "20px", minWidth: "325px" }}
                    />
                    <Button
                        color="primary"
                        variant="contained"
                        style={{ maxHeight: "40px", marginLeft: "10px" }}
                        onClick={this.onSubmit}
                    >
                        Nästa
                    </Button>
                </InputGroup>
            );
        } else {
            return (
                <ConfigGrid>
                    <Meetings
                        meetings={this.state.meetings}
                        tasks={this.state.tasks}
                        groups={this.state.groups}
                        pass={this.state.acceptedPassword}
                    />

                    <ConfigContainer>
                        <Divider />
                    </ConfigContainer>
                    {this.state.configList.map((conf, index) => {
                        {
                            switch (conf.type) {
                                case "string":
                                    return (
                                        <ConfigContainer key={conf.key}>
                                            <StyledTextField
                                                defaultValue={conf.value}
                                                label={conf.key}
                                                variant="outlined"
                                                value={
                                                    this.state.configList[index]
                                                        .value
                                                }
                                                onChange={newVal => {
                                                    this.handleChange(
                                                        index,
                                                        newVal
                                                    );
                                                }}
                                            />
                                        </ConfigContainer>
                                    );
                                case "number":
                                    return (
                                        <ConfigContainer key={conf.key}>
                                            <StyledTextField
                                                defaultValue={conf.value}
                                                label={conf.key + " (number)"}
                                                variant="outlined"
                                                value={
                                                    this.state.configList[index]
                                                        .value
                                                }
                                                onChange={newVal => {
                                                    if (
                                                        isNaN(
                                                            newVal.target.value
                                                        ) === false
                                                    ) {
                                                        this.handleChange(
                                                            index,
                                                            newVal
                                                        );
                                                    }
                                                }}
                                            />
                                        </ConfigContainer>
                                    );
                                case "long_string":
                                    return (
                                        <ConfigContainer key={conf.key}>
                                            <StyledTextField
                                                defaultValue={conf.value}
                                                label={conf.key}
                                                variant="outlined"
                                                multiline
                                                value={
                                                    this.state.configList[index]
                                                        .value
                                                }
                                                onChange={newVal => {
                                                    this.handleChange(
                                                        index,
                                                        newVal
                                                    );
                                                }}
                                            />
                                        </ConfigContainer>
                                    );
                                default:
                                    console.log(
                                        "ERROR, unknown conf type: " + conf.type
                                    );
                            }
                        }
                    })}
                    <ConfigContainer>
                        {this.state.errorMsg !== "" && (
                            <Typography
                                style={{
                                    textAlign: "center",
                                    maxWidth: "400px"
                                }}
                                variant="h6"
                                color="error"
                            >
                                {this.state.errorMsg}
                            </Typography>
                        )}
                        <Button
                            variant="contained"
                            color="primary"
                            style={{
                                width: "100%"
                            }}
                            onClick={this.onSave}
                        >
                            Spara
                        </Button>
                    </ConfigContainer>
                </ConfigGrid>
            );
        }
    }

    onSubmit() {
        let data = {
            pass: this.state.password
        };
        console.log("sending data to server", data);

        axios
            .put("http://localhost:5000/admin", data, {})
            .then(res => {
                console.log(res.statusText);
                let date = {};
                let name = "";
                let meetings_list = res.data.meetings.map(meeting => {
                    date = new Date(meeting.date);
                    name =
                        date.getFullYear() +
                        "_lp" +
                        meeting.lp +
                        "_" +
                        meeting.meeting_no;
                    meeting["name"] = name;
                    return meeting;
                });

                this.setState({
                    acceptedPassword: this.state.password,
                    configList: res.data.general,
                    meetings: meetings_list,
                    groups: res.data.groups,
                    tasks: res.data.tasks
                });

                console.log(res);
                console.log("STATE", this.state);
            })
            .catch(error => {
                if (error.response && error.response.status === 401) {
                    this.setState({
                        errorMsg: "Fel lösenord"
                    });
                } else {
                    this.onError(error);
                }
            });
    }

    onError(error) {
        console.log("ERROR", error);
        let msg = "An error has occured, please try again later! \n";

        if (error.response) {
            console.log(error.response);
            msg = msg + error.response.statusText + "\n";
        }

        this.setState({
            errorMsg: msg
        });
    }

    handleChange(confIndex, newVal) {
        let val = newVal.target.value;
        let newList = this.state.configList.map((item, index) => {
            if (index === confIndex) {
                item.value = val;
            }
            return item;
        });
        this.setState({
            configList: newList
        });
    }

    onSave() {
        // Send back the data to the server
        let data = {
            pass: this.state.acceptedPassword,
            config: this.state.configList
        };

        axios
            .post("http://localhost:5000/admin/config", data, {})
            .then(response => {
                this.setState({
                    errorMsg: ""
                });
                alert(
                    "Saved configs to server! \nResponse: " +
                        response.statusText
                );
            })
            .catch(error => {
                this.onError(error);
            });
    }
}
