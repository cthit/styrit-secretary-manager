import React, {Component} from "react";
import {DigitDialog, DigitHeader} from "@cthit/react-digit-components";
import Main from "../use-cases/main";
import DebugHeader from "../use-cases/debug";
import HeaderButtons from "../common/views/headerbuttons";
import {Route, Switch} from "react-router";
import Admin from "../use-cases/admin";
import {AppContainer, MainContainer} from "./App.styles.";
import AuthHandler from "../common/elements/AuthHandler/AuthHandler.container";

class App extends Component {
    constructor(props) {
        super(props);
        props.init();
    }

    render() {
        return (
            <AppContainer>
                <DigitDialog/>
                <DebugHeader/>
                <DigitHeader
                    dense
                    headerHeight="56px"
                    title="Dokumentinsamling"
                    renderHeader={() => <HeaderButtons/>}
                    renderMain={() => (
                        <MainContainer>
                            <Switch>
                                <Route path="/auth/account/callback"
                                       component={AuthHandler}/>
                                <Route path="/admin" component={Admin}/>
                                <Route path="/" component={Main}/>
                            </Switch>
                        </MainContainer>
                    )}
                />
            </AppContainer>
        );
    }
}

export default App;
