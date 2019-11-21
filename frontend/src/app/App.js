import React from "react";
import AppBar from "@material-ui/core/AppBar";
import ToolBar from "@material-ui/core/Toolbar";
import { Typography, Button } from "@material-ui/core";
import Body from "../use-cases/body";
import { BrowserRouter as Router, Route, Switch, Link } from "react-router-dom";
import Admin from "../use-cases/admin";

function App() {
    let debug = !process.env.NODE_ENV || process.env.NODE_ENV === "development";
    console.log("Debug mode: " + debug);
    let backend = "";
    if (debug) {
        backend = "http://localhost:5000";
    }

    return (
        <div>
            {debug && (
                <div
                    style={{
                        backgroundColor: "yellow",
                        display: "flex ",
                        alignItems: "center",
                        justifyContent: "center"
                    }}
                >
                    <h1
                        style={{
                            fontFamily: "Arial, Sans-serif",
                            textDecoration: "underline"
                        }}
                    >
                        DEBUG MODE
                    </h1>
                </div>
            )}
            <Router>
                <Switch>
                    <Route path="/admin">
                        <AppBar position="static">
                            <ToolBar>
                                <Typography
                                    variant="h6"
                                    style={{ flexGrow: "1" }}
                                >
                                    Dokumentinsamling
                                </Typography>
                                <Link to="" style={{ color: "white" }}>
                                    <Button color="inherit">Standard vy</Button>
                                </Link>
                            </ToolBar>
                        </AppBar>
                        <Admin debugMode={debug} backendAddress={backend} />
                    </Route>
                    <Route path="">
                        <AppBar position="static">
                            <ToolBar>
                                <Typography
                                    variant="h6"
                                    style={{ flexGrow: "1" }}
                                >
                                    Dokumentinsamling
                                </Typography>

                                <Link to="/admin" style={{ color: "white" }}>
                                    <Button color="inherit">Admin vy</Button>
                                </Link>
                            </ToolBar>
                        </AppBar>
                        <Body
                            props={{
                                debugMode: debug,
                                backendAddress: backend
                            }}
                        />
                    </Route>
                </Switch>
            </Router>
        </div>
    );
}

export default App;
