import React from "react";
import Config from "./screens/config/Config.container.screen";

export const Admin = props => {
    props.isAuthorized()
    return <Config/>
}


export default Admin;
