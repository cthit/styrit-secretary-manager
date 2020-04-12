import React from "react";
import ReactDOM from "react-dom";
import "./index.css";
import App from "./app";
import {DigitProviders} from "@cthit/react-digit-components";
import createMuiTheme from "@material-ui/core/styles/createMuiTheme";
import {rootReducer} from "./app/App.reducer";
import {Provider} from "react-redux";
import {applyMiddleware, createStore, combineReducers} from "redux";
import {unregister} from "./serviceWorker";
import logger from "redux-logger";
import thunkMiddleware from "redux-thunk";

const theme = createMuiTheme({
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

function getReducer(root) {
    return combineReducers({
        root
    })
}

const store = createStore(getReducer(rootReducer), applyMiddleware(logger, thunkMiddleware));
const reducers = combineReducers({rootReducer})

ReactDOM.render(
    <Provider store={store}>
        <DigitProviders theme={theme} rootReducer={{root: { reducers }}}>
            <App />
        </DigitProviders>
    </Provider>,
    document.getElementById("root")
);

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
unregister();
