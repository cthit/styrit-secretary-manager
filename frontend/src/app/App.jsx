import React, {Component} from "react";
import {DigitDialog, DigitHeader} from "@cthit/react-digit-components";
import Main from "../use-cases/main";
import DebugHeader from "../use-cases/debug";
import HeaderButtons from "../common/views/headerbuttons";
import {Route, Switch} from "react-router";
import Admin from "../use-cases/admin";
import {AppContainer, MainContainer} from "./App.styles.";
import {Gamma} from "../common/gamma/Gamma";

class App extends Component {
    constructor(props) {
        super(props);
        props.init();
    }

    render() {
        return (
            <AppContainer>
                <Gamma />
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
            </AppContainer>
        );
    }
}

export default App;
