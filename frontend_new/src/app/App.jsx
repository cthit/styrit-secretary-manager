import React, { Component } from "react";
import { DigitDialog, DigitHeader } from "@cthit/react-digit-components";
import Main from "../use-cases/main";
import DebugHeader from "../use-cases/debug";
import HeaderButtons from "../common/views/headerbuttons";
import { Route, Switch } from "react-router";
import Admin from "../use-cases/admin";
import { MainContainer } from "./App.styles.";

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
                        <MainContainer>
                            <Switch>
                                <Route path="/admin" component={Admin} />
                                <Route path="/" component={Main} />
                            </Switch>
                        </MainContainer>
                    )}
                />
            </div>
        );
    }
}

export default App;
