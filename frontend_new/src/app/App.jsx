import React, { Component } from "react";
import { DigitHeader, DigitButton } from "@cthit/react-digit-components";
import { Switch, Route } from "react-router-dom";
import Main from "../use-cases/main";
import DebugHeader from "../use-cases/debug";

class App extends Component {
    state = {
        debug: false
    };

    constructor(props) {
        super();
        props.init();
        console.log("FUCKIGN HELL!? ", props);
        this.state.debug = props.debug.debug;
    }

    render() {
        return (
            <div>
                <DebugHeader />
                <DigitHeader
                    dense
                    headerHeight="56px"
                    title="Dokumentinsamling"
                    renderHeader={() => (
                        <DigitButton text="Admin vy"></DigitButton>
                    )}
                    renderMain={() => (
                        <Switch>
                            <Route path="/" component={Main} />
                            <Route path="/Admin" component={null} />
                        </Switch>
                    )}
                ></DigitHeader>
            </div>
        );
    }
}

export default App;
