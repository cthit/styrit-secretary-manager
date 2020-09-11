import React from "react";
import Config from "./screens/config";
import {useGamma, useGammaMe} from "@cthit/react-digit-components";
import {isVerified} from "../../common/functions/isAuthorized";
import {NotAuthorized} from "./screens/not-authorized/NotAuthorized";

export const Admin = props => {
    useGamma()
    const me = useGammaMe()
    console.log("ME: ", me)

    if (isVerified(me)) {
        return <Config/>;
    } else {
        props.notAuthorized()
        return <NotAuthorized/>
    }
};

export default Admin;
