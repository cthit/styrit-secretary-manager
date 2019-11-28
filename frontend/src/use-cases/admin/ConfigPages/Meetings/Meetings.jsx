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

import {
  MeetingsContainer,
  InputContainer,
  Space,
  CenterText
} from "./Meetings.styles";
import axios from "axios";

const defaultState = {
  debugMode: false,
  backendAddress: "",
  meetings: {},
  selectedMeetingNumber: -1,
  selectedMeeting: null,
  rows: []
};

export class Meetings extends React.Component {
  constructor(props) {
    super(props);

    defaultState.debugMode = props.debugMode;
    defaultState.backendAddress = props.backendAddress;

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
    this.handleCheckAll = this.handleCheckAll.bind(this);
    this.getAllChecked = this.getAllChecked.bind(this);
    this.getCode = this.getCode.bind(this);
    this.onSave = this.onSave.bind(this);
    this.onNewMeeting = this.onNewMeeting.bind(this);
    this.getMeetingName = this.getMeetingName.bind(this);
    this.onSendMail = this.onSendMail.bind(this);
    this.onStartTimer = this.onStartTimer.bind(this);
    this.onArchiveDownload = this.onArchiveDownload.bind(this);
  }

  render() {
    return (
      <MeetingsContainer>
        <Typography variant="h4">Meetings</Typography>

        <InputContainer>
          <div>
            <InputLabel ref={this.state.inputLabel} htmlFor="meeting-select">
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
                <MenuItem value={index}>{meeting.name}</MenuItem>
              ))}
            </Select>
          </div>
          <Space />
          <Button
            variant="contained"
            color="primary"
            onClick={this.onNewMeeting}
          >
            New Meeting
          </Button>
        </InputContainer>
        {this.state.selectedMeeting && (
          <div>
            <InputContainer>
              <MuiPickersUtilsProvider utils={DateFnsUtils}>
                <DateTimePicker
                  autoOk
                  ampm={false}
                  label="Date"
                  value={this.state.selectedMeeting.date}
                  onChange={event => {
                    if (this.state.debugMode) {
                      console.log("STATE", this.state);
                    }
                    let meeting = this.state.selectedMeeting;
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
                  value={new Date(
                    this.state.selectedMeeting.last_upload_date
                  ).toISOString()}
                  format="dd/MM/yyyy HH:mm"
                  onChange={event => {
                    let meeting = this.state.selectedMeeting;
                    meeting.last_upload_date = event.toISOString();
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
                    let meeting = this.state.selectedMeeting;
                    meeting.lp = parseInt(event.target.value, 10);
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
                    let meeting = this.state.selectedMeeting;
                    meeting.meeting_no = parseInt(event.target.value, 10);
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
                      <Checkbox
                        checked={this.get}
                        onChange={() => this.handleCheckAll(col)}
                      />
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
                          checked={this.getChecked(row, col)}
                          onChange={() => this.handleCheck(row, col)}
                        />
                      </TableCell>
                    ))}
                    <TableCell align="right">{this.getCode(row)}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
            <Button
              variant="contained"
              color="primary"
              style={{
                width: "100%"
              }}
              onClick={this.onSave}
            >
              Spara (mötesinställningarna)
            </Button>
            <CenterText>
              <Typography>
                Skickar mailet för detta möte (OBS! Sparar också de nuvarande
                mötesinställningarna!)
              </Typography>
            </CenterText>
            <Button
              variant="contained"
              color="secondary"
              style={{
                width: "100%"
              }}
              onClick={this.onSendMail}
            >
              Skicka mail
            </Button>
            <CenterText>
              <Typography>
                Flaggar att mötets deadline ska kollas efter, när denna tar slut
                kommer en länk skickas till styrelsen där alla filer kan laddas
                ned.
              </Typography>
            </CenterText>
            <Button
              variant="contained"
              color="secondary"
              style={{
                width: "100%"
              }}
              onClick={this.onStartTimer}
            >
              Starta deadline koll
            </Button>
            <CenterText>
              <Typography>
                Laddar ned arkivet (med alla dokument) för detta möte (OBS!
                Sparar också de nuvarande mötesinställningarna!)
              </Typography>
            </CenterText>
            <Button
              variant="contained"
              color="primary"
              style={{
                width: "100%"
              }}
              onClick={this.onArchiveDownload}
            >
              Ladda ned arkiv
            </Button>
          </div>
        )}
      </MeetingsContainer>
    );
  }

  getChecked(group, task) {
    let g_t = this.state.selectedMeeting.groups_tasks[task.name];
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
    if (this.state.debugMode) {
      console.log(meeting);
    }
    this.setState({
      selectedMeeting: meeting
    });
  }

  handleCheckAll(task) {
    this.state.groups.forEach(group => {
      this.handleCheck(group, task);
    });
  }

  // Returns whether or not all of the groups has this task checked.
  getAllChecked(task) {
    let meeting = this.state.selectedMeeting;
    let allChecked = true;
    this.state.groups.forEach(group => {
      if (meeting.groups_tasks[task.name].includes(group.name) === false) {
        allChecked = false;
      }
    });
    return allChecked;
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

  onNewMeeting() {
    let today = new Date().toISOString();
    let meeting = {
      id: "new",
      date: today,
      last_upload_date: today,
      lp: 1,
      meeting_no: 0,
      groups_tasks: {}
    };

    meeting.name = this.getMeetingName(meeting);

    let state = this.state;
    state.meetings.push(meeting);

    let meetingNumber = state.meetings.findIndex(elem => elem === meeting);
    this.setState({
      meetings: state.meetings,
      selectedMeetingNumber: meetingNumber,
      selectedMeeting: meeting
    });
  }

  onSave() {
    return new Promise((resolve, reject) => {
      if (this.state.selectedMeetingNumber < 0) {
        reject(Error("No valid meeting selected"));
      }

      let meeting = this.state.selectedMeeting;
      meeting.name = this.getMeetingName(meeting);
      if (this.state.debugMode) {
        console.log("STATE", this.state);
      }
      let data = {
        pass: this.state.pass,
        meeting: meeting
      };
      // Update the state meetings list with the response from the server.
      axios
        .post(this.state.backendAddress + "/admin/config/meeting", data, {})
        .then(res => {
          if (this.state.debugMode) {
            console.log("RESPONSE", res);
          }
          alert("Meeting saved successfully");
          // Update the new meeting with the response meeting.
          meeting.groups_tasks = res.data.groups_tasks;
          meeting.id = res.data.id;
          this.setState({
            selectedMeeting: meeting
          });
          resolve("Meeting saved successfully!");
        })
        .catch(error => {
          if (this.state.debugMode) {
            console.log("ERROR", error);
          }
          let msg = error;
          if (error && error.response && error.response.data) {
            msg = error.response.data.error;
          }
          alert("Something went wrong: " + msg);
          reject(Error("Unable to save meeting"));
        });
    });
  }

  onSendMail() {
    // First save the current meeting
    this.onSave()
      .then(() => {
        let data = {
          pass: this.state.pass,
          id: this.state.selectedMeeting.id
        };

        axios
          .put(this.state.backendAddress + "/mail", data, {})
          .then(res => {
            if (this.state.debugMode) {
              console.log("RESPONSE", res);
            }
            alert("Mail(s) sent successfull");
          })
          .catch(error => {
            if (this.state.debugMode) {
              console.log("ERROR", error);
            }
            alert("Something went wrong with sending the email \n" + error);
          });
      })
      .catch(() => {
        if (this.state.debugMode) {
          console.log(
            "Unable to send mail as something went wrong with saving the meeting."
          );
        }
      });
  }

  getMeetingName(meeting) {
    return (
      new Date(meeting.date).getFullYear() +
      "_lp" +
      meeting.lp +
      "_" +
      meeting.meeting_no
    );
  }

  onStartTimer() {
    let data = {
      pass: this.state.pass
    };
    let meeting_id = this.state.selectedMeeting.id;
    axios
      .post(this.state.backendAddress + "/timer/" + meeting_id, data, {})
      .then(res => {
        alert("Timer started for meeting");
      })
      .catch(err => {
        if (this.state.debugMode) {
          console.log("ERROR: ", err);
        }
        alert("Something went wrong :(");
      });
  }

  onArchiveDownload() {
    this.onSave().then(() => {
      let meeting_id = this.state.selectedMeeting.id;

      axios
        .post(this.state.backendAddress + "/archive/" + meeting_id)
        .then(res => {
          if (this.state.debugMode) {
            let code = res.data;
            // Redirect to the download link
            window.location.replace(
              this.state.backendAddress + "/archive/" + code
            );
            console.log("Should download file?", res);
          }
        })
        .catch(err => {
          if (this.state.debugMode) {
            console.log("ERROR: ", err);
          }
          alert("Something went wrong :(");
        });
    });
  }
}
