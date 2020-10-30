import React from "react";
import Config from "./screens/config";
import Gamma from "./screens/gamma-login";

export const Admin = props => {
    if (props.passwordVerified) {
        return <Config/>;
    } else {
        // return <Password/>;
        return <Gamma/>
    }
};

export default Admin;
