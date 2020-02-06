import React from "react";
import { AdminContainer } from "./Admin.styles";
import { DigitButton } from "@cthit/react-digit-components";
import Password from "./screens/password";
import Config from "./screens/config";

export const Admin = props => {
    if (props.data) {
        return <Config />;
    } else {
        return <Password />;
    }
};

export default Admin;
