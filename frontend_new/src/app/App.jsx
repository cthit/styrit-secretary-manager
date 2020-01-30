import React, { Component } from "react";
import { DigitHeader, DigitButton } from "@cthit/react-digit-components";
import { Switch, Route } from "react-router-dom";
import Main from "../use-cases/main";

class App extends Component {
    constructor(props) {
        super();
        props.init();
    }

    render() {
        return (
            <DigitHeader
                dense
                headerHeight="56px"
                title="Dokumentinsamling"
                renderHeader={() => <DigitButton text="Admin vy"></DigitButton>}
                renderMain={() => (
                    <Switch>
                        <Route path="/" component={Main} />
                        <Route path="/Admin" component={null} />
                    </Switch>
                )}
            ></DigitHeader>
        );
    }
}

export default App;
