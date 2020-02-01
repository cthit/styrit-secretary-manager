import React from "react";
import ReactDOM from "react-dom";
import "./index.css";
import App from "./app";
import * as serviceWorker from "./serviceWorker";
import { DigitProviders, DigitDialog } from "@cthit/react-digit-components";
import createMuiTheme from "@material-ui/core/styles/createMuiTheme";
import { rootReducer } from "./app/App.reducer";

let theme = createMuiTheme({
    palette: {
        primary: {
            main: "#3f51b5",
            dark: "#002984",
            light: "#757de8"
        },
        secondary: {
            main: "#ffa500",
            dark: "#c67600",
            light: "#ffd64a"
        }
    }
});

ReactDOM.render(
    <DigitProviders theme={theme} rootReducer={{ root: rootReducer }}>
        <DigitDialog />
        <App />
    </DigitProviders>,
    document.getElementById("root")
);

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
serviceWorker.unregister();
