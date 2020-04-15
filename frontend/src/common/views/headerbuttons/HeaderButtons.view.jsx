import React from "react";
import { DigitButton, DigitDesign } from "@cthit/react-digit-components";
import { Route, Switch } from "react-router-dom";
import { HeaderButtonsContainer } from "./HeaderButtons.styles.";
import Button from "@material-ui/core/Button";

export const HeaderButtons = props => (
    <HeaderButtonsContainer>
        <Switch>
            <Route
                path="/admin"
                component={() => (
                    <DigitDesign.Link to={"/"}>
                        <Button variant="contained" style={{color: "black", backgroundColor: "#ffa500"}}>
                            Standard vy
                        </Button>
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