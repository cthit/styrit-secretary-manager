import React from "react";
import { DigitButton, DigitDesign } from "@cthit/react-digit-components";
import { Switch, Route } from "react-router-dom";
import { Button } from "@material-ui/core";

export const HeaderButtons = props => (
    <Switch>
        <Route
            path="/admin"
            component={() => (
                <DigitDesign.Link to={"/"}>
                    <Button
                        variant="contained"
                        color="secondary"
                        style={{
                            backgroundColor: "#ffa500",
                            color: "black"
                        }}
                    >
                        Standard vy
                    </Button>
                    {/* <DigitButton
                        raised
                        secondary
                        text="Standard vy"
                    ></DigitButton> */}
                </DigitDesign.Link>
            )}
        />
        <Route
            path="/"
            component={() => (
                <DigitDesign.Link to={"/admin"}>
                    <DigitButton raised secondary text="Admin vy"></DigitButton>
                </DigitDesign.Link>
            )}
        />
    </Switch>
);

export default HeaderButtons;
