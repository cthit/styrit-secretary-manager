import React from "react";
import { ButtonGroup, ButtonContainer } from "./Config.styles.screen";
import { DigitButton } from "@cthit/react-digit-components";
import { meeting_mode, general_mode } from "./Config.modes.screen";
import Meeting from "./views/meeting/";
import General from "./views/general/";

export const Config = props => (
    <div>
        <ButtonGroup>
            <ButtonContainer>
                <DigitButton
                    text="Meeting Config"
                    raised
                    primary
                    disabled={props.mode === meeting_mode}
                    onClick={() => props.onModeButtonClicked(meeting_mode)}
                />
            </ButtonContainer>
            <ButtonContainer>
                <DigitButton
                    text="General Config"
                    raised
                    primary
                    disabled={props.mode === general_mode}
                    onClick={() => props.onModeButtonClicked(general_mode)}
                />
            </ButtonContainer>
        </ButtonGroup>
        {props.mode === meeting_mode && <Meeting />}
        {props.mode === general_mode && <General />}
    </div>
);

export default Config;
