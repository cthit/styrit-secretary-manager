import React from "react";
import {
    ConfigContainer,
    ConfigListContainer,
    GeneralConfigContainer,
    HelpCard,
    HLine
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


const test = "asd <br/> bsd"

export const General = props => (
    <GeneralConfigContainer>
        <ConfigListContainer>
            {props.configs.map((config, index) => {
                return (
                    <ConfigContainer key={index}>
                        {getRightConfig(config, props)}
                        <DigitIconButton icon={HelpIcon}
                                         size={{width: "56px", height: "56px"}}
                                         secondary={props.selectedConfigIndex === index}
                                         primary={props.selectedConfigIndex !== index}
                                         onClick={() => {
                                             props.configHelpButtonPressed(index);
                                             console.log("ASD", props.selectedConfigIndex, " --- ", index);
                                         }}
                        />
                    </ConfigContainer>
                )
            })}
            <HLine/>
            <DigitButton primary raised text={"Save"} size={{width: "100%"}}
                         onClick={() => props.onConfigSave(props.password, props.configs)}/>
        </ConfigListContainer>
        {props.selectedHelp &&
        <HelpCard>
            <DigitText.Title text={"Description"}/>
            <DigitText.Text text={"For '" + props.selectedHelp.key + "'"}/>
            <DigitMarkdown markdownSource={props.selectedHelp.description}
                           size={{maxWidth: "90%"}}
                           padding={{left: "10px", right: "10px"}}/>
        </HelpCard>
        }
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
