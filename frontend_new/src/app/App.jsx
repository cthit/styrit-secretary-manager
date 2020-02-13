import React, { Component } from "react";
import { DigitHeader, DigitDialog } from "@cthit/react-digit-components";
import { Switch, Route } from "react-router-dom";
import Main from "../use-cases/main";
import DebugHeader from "../use-cases/debug";
import Admin from "../use-cases/admin";
import HeaderButtons from "../common/views/headerbuttons";

class App extends Component {
    state = {
        debug: false
    };

    constructor(props) {
        super();
        props.init();
        console.log("FUCKIGN HELL!? ", props);
        this.state.debug = props.debug.debug;
        props.helper("asd123");
    }

    render() {
        return (
            <div>
                <DigitDialog />
                <DebugHeader />
                <DigitHeader
                    dense
                    headerHeight="56px"
                    title="Dokumentinsamling"
                    renderHeader={() => <HeaderButtons />}
                    renderMain={() => (
                        <Switch>
                            <Route path="/admin" component={Admin} />
                            <Route path="/" component={Main} />
                        </Switch>
                    )}
                ></DigitHeader>
            </div>
        );
    }
}

export default App;
