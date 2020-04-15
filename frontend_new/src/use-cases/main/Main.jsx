import React from "react";
import Code from "./screens/code";
import Upload from "./screens/upload/";

export const Main = props => {
    if (props.acceptedCode) {
        return <Upload />;
    } else {
        return <Code />;
    }
};

export default Main;
