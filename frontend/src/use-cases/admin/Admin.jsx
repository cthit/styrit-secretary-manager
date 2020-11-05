import React from "react";
import Config from "./screens/config";
import Gamma from "./screens/gamma-login/Gamma.container.screen";

const Admin = props => {
    if (props.isAuthorized) {
        return <Config/>;
    } else {
        return <Gamma/>;
    }
};

export default Admin;
