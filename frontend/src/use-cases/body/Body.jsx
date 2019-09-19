import React from "react";
import { BodyContainer, InputGroup } from "./Body.styles";
import { TextField, Button, Divider } from "@material-ui/core";
import Upload from "./Upload";
import axios from "axios";

const defaultState = {
    code: "",
    acceptedCode: null,
    group: null,
    tasks: {

    },
    reports: {
        
    }
}

export class Body extends React.Component {
    constructor(props) {
        super(props);
        this.state = defaultState;

        this.chooseBody = this.chooseBody.bind(this);
        this.onSubmit = this.onSubmit.bind(this);
        this.onUpload = this.onUpload.bind(this);
        this.onUploadUpdated = this.onUploadUpdated.bind(this);
        this.checkValid = this.checkValid.bind(this);
    }

    render() {
        return (
            <BodyContainer className="body-container">
                { this.chooseBody() }
            </BodyContainer>
        )
    }
    
    chooseBody() {
        if (this.state.acceptedCode !== null) {
            return (
                <InputGroup className="input-group">
                    {
                        Object.keys(this.state.tasks).map(task => (
                            <Upload text={task} name={this.state.tasks[task]} onUploadUpdated={this.onUploadUpdated} key={this.state.tasks[task]}/>
                        ))
                    }
                    <Button variant="contained" color="primary" style={{maxHeight: "40px"}} onClick={this.onUpload} disabled={this.checkValid()}>
                        Submit
                    </Button>
                </InputGroup>
            );
        } else {
            return (
                <InputGroup>
                    <TextField
                        label="Code"
                        variant="outlined"
                        onChange={event => { 
                            const text = event.target.value
                            this.setState((state, props) => ({
                                code: text
                            }))
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
        }
    }

    onSubmit() {
        console.log("State", this)
        const data = {
            code: this.state.code
        }
    
        console.log("data", data)
    
        axios
            .post("http://localhost:5000/code", data, {})
            .then(res => {
                console.log(res.statusText);
            
                
                let reports = {}

                Object.values(res.data.tasks).forEach(task => {
                    reports[task] = undefined
                })

                this.setState((state, props) => ({
                    acceptedCode: res.data.code,
                    group: res.data.group,
                    tasks: res.data.tasks,
                    reports: reports
                }));

                console.log("STATE", this.state)
            })
            .catch(error => {
                console.log("Error: ", error);
            });
    }

    onUploadUpdated(data) {

        if (data) {
            console.log("DATA", data);
            
            let oldState = this.state;
            oldState.reports[data.type] = data.file; 

            this.setState(oldState)

            console.log("STATE", this.state)
        }
    }

    onUpload() {
        if (!this.checkValid) {

        }
        this.setState(defaultState)
    }    

    checkValid() {
        let reports = this.state.reports;
        let disable = false;
        Object.keys(reports).forEach(key => {
            if (!reports[key]) {
                console.log("Error, no all fields filled");
                disable = true;
            }
            console.log("Key", key)
            console.log("Rep[key]", reports[key])
            console.log("Reports", reports)
        })
        console.log("SAYING OK")
        return disable;
    }
}

