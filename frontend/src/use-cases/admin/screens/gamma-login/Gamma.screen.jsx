import React from "react";
import {DigitButton, DigitText} from "@cthit/react-digit-components";
import {GammaLoginContainer} from "./Gamma.styles.screen";
import {InfoCard} from "../config/views/stories/Stories.styles.view.jsx.";

export const Gamma = props => (
    <GammaLoginContainer>
        <InfoCard>
            <DigitText.Text
                text="Inloggning, endast för styrIT!"/>
        </InfoCard>
        {
            props.errorMsg !== "" && (
                <DigitText.Text style={{color: "red"}} text={props.errorMsg}/>
            )
        }
        <DigitButton text="Logga in med Gamma" raised primary
                     onClick={
                         props.authorizeAdmin
                     }
                     size={{width: "320px", height: "50px"}}
        />
    </GammaLoginContainer>
);