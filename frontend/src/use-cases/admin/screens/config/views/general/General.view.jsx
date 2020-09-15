import React from "react";
import {
    ConfigContainer,
    ConfigListContainer,
    GeneralConfigContainer,
    HelpCard,
    HLine,
    LeftCol
} from "./General.styles.view.jsx.";
import {
    DigitButton,
    DigitIconButton,
    DigitMarkdown,
    DigitText,
    DigitTextArea,
    DigitTextField
} from "@cthit/react-digit-components";
import HelpIcon from '@material-ui/icons/Help';

const markdown =
    " - {0} = the first ever cool thing. \n " +
    " - {1} = The second cool thing ever"

export const General = props => (
    <GeneralConfigContainer>
        <LeftCol/>
        <ConfigListContainer>
            {props.configs.map((config, index) => {
                return (
                    <ConfigContainer key={index}>
                        {getRightConfig(config, props)}
                        <DigitIconButton icon={HelpIcon}
                                         size={{width: "56px"}}
                                         primary/>
                    </ConfigContainer>
                )
            })}
            <HLine/>
            <DigitButton primary raised text={"Save"} size={{width: "100%"}}
                         onClick={() => props.onConfigSave(props.password, props.configs)}/>
        </ConfigListContainer>
        <HelpCard>
            <DigitText.Title text={"Description"}/>
            <DigitText.Text text={"For 'some_email_text'"}/>
            <DigitMarkdown markdownSource={markdown}/>
        </HelpCard>
    </GeneralConfigContainer>
);

function getRightConfig(config, props) {
    switch (config.type) {
        case "string":
            return (
                <DigitTextField
                    value={config.value}
                    outlined
                    upperLabel={config.key}
                    size={{
                        width: "100%"
                    }}
                    onChange={e => props.onConfigChange(config.key, e.target.value)}
                />
            );
        case "number":
            return (
                <DigitTextField
                    value={config.value}
                    numbersOnly
                    outlined
                    upperLabel={config.key}
                    size={{
                        width: "100%"
                    }}
                    onChange={e => props.onConfigChange(config.key, e.target.value)}
                />
            );
        case "long_string":
            return (
                <DigitTextArea
                    value={config.value}
                    outlined
                    upperLabel={config.key}
                    size={{
                        width: "100%"
                    }}
                    rows={10}
                    onChange={e => props.onConfigChange(config.key, e.target.value)}
                />
            );
        default:
            console.log("Error, Unknown config type: " + config.type);
            return <div/>
    }
}

export default General;
