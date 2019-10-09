import React from "react";
import AppBar from "@material-ui/core/AppBar";
import ToolBar from "@material-ui/core/Toolbar";
import { Typography, Button } from "@material-ui/core";
import Body from "../use-cases/body";
import { BrowserRouter as Router, Route, Switch, Link } from "react-router-dom";
import { NavLink } from "react-router-dom/cjs/react-router-dom.min";

function App() {
    return (
        <div>
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
                                    <Button color="inherit">
                                        Default view
                                    </Button>
                                </Link>
                            </ToolBar>
                        </AppBar>
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
                                    <Button color="inherit">Admin</Button>
                                </Link>
                            </ToolBar>
                        </AppBar>
                        <Body />
                    </Route>
                </Switch>
            </Router>
        </div>
    );
}

export default App;
