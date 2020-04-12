import React from "react";
import { DigitButton, DigitDesign } from "@cthit/react-digit-components";
import { Route, Switch } from "react-router-dom";
import { HeaderButtonsContainer } from "./HeaderButtons.styles.";

export const HeaderButtons = props => (
    <HeaderButtonsContainer>
        <Switch>
            <Route
                path="/admin"
                component={() => (
                    <DigitDesign.Link to={"/"}>
                        <DigitButton raised secondary text={"Standard vy"} />
                    </DigitDesign.Link>
                )}
            />
            <Route
                path="/"
                component={() => (
                    <DigitDesign.Link to={"/admin"}>
                        <DigitButton raised secondary text="Admin vy" />
                    </DigitDesign.Link>
                )}
            />
        </Switch>
    </HeaderButtonsContainer>
);

export default HeaderButtons;