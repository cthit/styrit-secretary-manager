import React from "react";

import {
    Select,
    MenuItem,
    InputLabel,
    TextField,
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableRow,
    Checkbox,
    Typography,
    Button
} from "@material-ui/core";

import { MuiPickersUtilsProvider, DateTimePicker } from "@material-ui/pickers";
import DateFnsUtils from "@date-io/date-fns";

import { MeetingsContainer, InputContainer } from "./Meetings.styles";
import axios from "axios";

const defaultState = {
    meetings: {},
    selectedMeetingNumber: -1,
    selectedMeeting: null,
    rows: []
};

export class Meetings extends React.Component {
    constructor(props) {
        super(props);
        defaultState.meetings = props.meetings;
        defaultState.tasks = props.tasks;
        defaultState.groups = props.groups;
        defaultState.checkBoxes = [];
        defaultState.pass = props.pass;
        this.state = defaultState;

        this.onSelectMeeting = this.onSelectMeeting.bind(this);
        this.getSelectedMeeting = this.getSelectedMeeting.bind(this);
        this.getChecked = this.getChecked.bind(this);
        this.handleCheck = this.handleCheck.bind(this);
        this.getCode = this.getCode.bind(this);
        this.onSave = this.onSave.bind(this);
    }

    render() {
        return (
            <MeetingsContainer>
                <Typography variant="h4">Meetings</Typography>

                <InputContainer>
                    <div>
                        <InputLabel
                            ref={this.state.inputLabel}
                            htmlFor="meeting-select"
                        >
                            Meeting
                        </InputLabel>

                        <Select
                            value={this.state.selectedMeetingNumber}
                            style={{ minWidth: "150px" }}
                            onChange={this.onSelectMeeting}
                            inputProps={{
                                name: "Meeting",
                                id: "meeting-select"
                            }}
                        >
                            {this.state.meetings.map((meeting, index) => (
                                <MenuItem value={index}>
                                    {meeting.name}
                                </MenuItem>
                            ))}
                        </Select>
                    </div>
                </InputContainer>
                {this.state.selectedMeeting && (
                    // This is where we put that code!!!
                    <div>
                        <InputContainer>
                            <MuiPickersUtilsProvider utils={DateFnsUtils}>
                                <DateTimePicker
                                    autoOk
                                    ampm={false}
                                    label="Date"
                                    value={this.state.selectedMeeting.date}
                                    onChange={event => {
                                        console.log("STATE", this.state);
                                        let meeting = this.state
                                            .selectedMeeting;
                                        meeting.date = event.toISOString();
                                        this.setState({
                                            selectedMeeting: meeting
                                        });
                                    }}
                                    format="dd/MM/yyyy HH:mm"
                                />
                                <DateTimePicker
                                    autoOk
                                    ampm={false}
                                    label="Deadline for uploads"
                                    value={
                                        this.state.selectedMeeting
                                            .lastUploadDate
                                    }
                                    format="dd/MM/yyyy HH:mm"
                                    onChange={event => {
                                        let meeting = this.state
                                            .selectedMeeting;
                                        meeting.lastUploadDate = event.toISOString();
                                        this.setState({
                                            selectedMeeting: meeting
                                        });
                                    }}
                                />
                            </MuiPickersUtilsProvider>

                            <TextField
                                defaultValue={0}
                                label={"Study period"}
                                value={this.state.selectedMeeting.lp}
                                onChange={event => {
                                    if (isNaN(event.target.value) === false) {
                                        let meeting = this.state
                                            .selectedMeeting;
                                        meeting.lp = event.target.value;
                                        this.setState({
                                            selectedMeeting: meeting
                                        });
                                    }
                                }}
                            />
                            <TextField
                                defaultValue={0}
                                label={"Meeting number"}
                                value={this.state.selectedMeeting.meeting_no}
                                onChange={event => {
                                    if (isNaN(event.target.value) === false) {
                                        let meeting = this.state
                                            .selectedMeeting;
                                        meeting.meeting_no = event.target.value;
                                        this.setState({
                                            selectedMeeting: meeting
                                        });
                                    }
                                }}
                            />
                        </InputContainer>
                        <Table aria-label="Tasks" size="small">
                            <TableHead>
                                <TableRow>
                                    <TableCell>Task</TableCell>
                                    {this.state.tasks.map(col => (
                                        <TableCell align="right">
                                            {col.display_name}
                                            <Checkbox checked={false} />
                                        </TableCell>
                                    ))}
                                    <TableCell align="center">Code</TableCell>
                                </TableRow>
                            </TableHead>
                            <TableBody>
                                {this.state.groups.map(row => (
                                    <TableRow key={row.name}>
                                        <TableCell component="th" scope="row">
                                            {row.display_name}
                                        </TableCell>
                                        {this.state.tasks.map(col => (
                                            <TableCell align="right">
                                                <Checkbox
                                                    checked={this.getChecked(
                                                        row,
                                                        col
                                                    )}
                                                    onChange={() =>
                                                        this.handleCheck(
                                                            row,
                                                            col
                                                        )
                                                    }
                                                />
                                            </TableCell>
                                        ))}
                                        <TableCell align="right">
                                            {this.getCode(row)}
                                        </TableCell>
                                    </TableRow>
                                ))}
                            </TableBody>
                        </Table>
                    </div>
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
            </MeetingsContainer>
        );
    }

    getChecked(group, task) {
        // console.log("groups_tasks", this.state.selectedMeeting.groups_tasks);
        let g_t = this.state.selectedMeeting.groups_tasks[task.name];
        // console.log("GROUP", group);
        // console.log("TASK", task);
        // console.log("G_T", g_t);
        if (g_t) {
            for (let i = 0; i < g_t.length; i++) {
                if (g_t[i].name === group.name) {
                    return true;
                }
            }
        }
        return false;
    }

    handleCheck(group, task) {
        let meeting = this.state.selectedMeeting;
        let g_t = meeting.groups_tasks;
        if (g_t[task.name] === undefined) {
            g_t[task.name] = [];
        }

        let removeIndex = -1;
        for (let i = 0; i < g_t[task.name].length; i++) {
            if (g_t[task.name][i].name === group.name) {
                removeIndex = i;
            }
        }

        if (removeIndex <= -1) {
            // Didn't find the group so instead we need to add it.
            meeting.groups_tasks[task.name].push({
                name: group.name
            });
        } else {
            // Remove the group
            meeting.groups_tasks[task.name].splice(removeIndex, 1);
        }

        this.setState({
            selectedMeeting: meeting
        });
    }

    getCode(group) {
        let code = "No code generated yet";
        Object.values(this.state.selectedMeeting.groups_tasks).forEach(task =>
            task.forEach(g => {
                if (g.name === group.name && g.code !== undefined) {
                    code = g.code;
                }
            })
        );
        return code;
    }

    onSelectMeeting(event) {
        let newMeetingNo = event.target.value;
        let newMeeting = this.state.meetings[newMeetingNo];
        this.setState({
            selectedMeetingNumber: newMeetingNo,
            selectedMeeting: newMeeting
        });
    }

    getSelectedMeeting() {
        return this.state.meetings[this.state.selectedMeeting];
    }

    onSave() {
        if (this.state.selectedMeetingNumber < 0) {
            return;
        }

        let newMeetings = this.state.meetings;
        let meeting = this.state.selectedMeeting;
        meeting.name =
            new Date(meeting.date).getFullYear() +
            "_lp" +
            meeting.lp +
            "_" +
            meeting.meeting_no;
        console.log("STATE", this.state);
        let data = {
            pass: this.state.pass,
            meeting: meeting
        };
        // Update the state meetings list with the response from the server.
        axios
            .post("http://localhost:5000/admin/config/meeting", data, {})
            .then(response => {
                console.log("RESPONSE" + response);
            })
            .catch(error => {
                alert("Something went wrong" + error);
            });
    }
}
