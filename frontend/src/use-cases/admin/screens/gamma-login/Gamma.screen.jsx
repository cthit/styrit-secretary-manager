import React from "react";
import {DigitButton} from "@cthit/react-digit-components";

export const Gamma = props => (
    <div>
        <DigitButton text="Gamma login" raised primary
                     onClick={props.loginWithGamma}/>
    </div>
);