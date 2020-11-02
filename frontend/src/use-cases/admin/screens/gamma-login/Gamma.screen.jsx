import React from "react";
import {DigitButton, DigitText} from "@cthit/react-digit-components";
import {InfoCard} from "../password/Password.styles.screen";
import {GammaLoginContainer} from "./Gamma.styles.screen";

export const Gamma = props => (
    <GammaLoginContainer>
        <InfoCard>
            <DigitText.Text
                text="Inloggning, endast för styrIT!"/>
        </InfoCard>
        <DigitButton text="Logga in med Gamma" raised primary
                     onClick={
                         props.authorizeAdmin
                     }
                     size={{width: "320px", height: "50px"}}
        />
    </GammaLoginContainer>
);