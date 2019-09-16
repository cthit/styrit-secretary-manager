import React from 'react';
import AppBar from '@material-ui/core/AppBar'
import ToolBar from '@material-ui/core/Toolbar'
import { Typography } from '@material-ui/core';
import Body from "../use-cases/body"

function App() {
  return (
    <div>
        <AppBar position="static">
            <ToolBar>
                <Typography variant="h6" style={{flexGrow: "1"}}>
                    Dokumentinsamling
                </Typography>
            </ToolBar>
        </AppBar>
        <Body/>
    </div>
  );
}

export default App;
