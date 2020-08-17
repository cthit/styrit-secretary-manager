import React from "react"
import {useGamma, useGammaMe} from "@cthit/react-digit-components";

export const Gamma = () => {

    useGamma()
    const me = useGammaMe()
    console.log("ME: ", me)

    return (
        <div />
    )

};