import React from "react";
import { ButtonContainer, ButtonGroup, ConfigContainer } from "./Config.styles.screen";
import { DigitButton } from "@cthit/react-digit-components";
import { general_mode, meeting_mode, stories_mode } from "./Config.modes.screen";
import Meeting from "./views/meeting/";
import General from "./views/general/";
import Stories from "./views/stories/";

export const Config = props => (
    <ConfigContainer>
        <ButtonGroup>
            <ButtonContainer>
                <DigitButton
                    text="Historical Config"
                    raised
                    primary
                    disabled={props.mode === stories_mode}
                    onClick={() => props.onModeButtonClicked(stories_mode)}
                />
            </ButtonContainer>
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
        {props.mode === stories_mode && <Stories />}
    </ConfigContainer>
);

export default Config;
