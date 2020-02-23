import React from "react";
import Password from "./screens/password";
import Config from "./screens/config";

export const Admin = props => {
    if (props.meetings) {
        return <Config />;
    } else {
        return <Password />;
    }
};

export default Admin;
