import React from "react";
import { DigitHeader, DigitButton } from "@cthit/react-digit-components";
import { Switch, Route } from "react-router-dom";
import Main from "../use-cases/main";

function App() {
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

export default App;
