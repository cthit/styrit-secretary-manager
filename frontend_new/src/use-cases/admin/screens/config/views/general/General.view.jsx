import React from "react";
import { ConfigContainer, ConfigListContainer, GeneralConfigContainer, HLine } from "./General.styles.view.jsx.";
import { DigitButton, DigitText, DigitTextArea, DigitTextField } from "@cthit/react-digit-components";

export const General = props => (
    <GeneralConfigContainer>
        <DigitText.Heading5 text={"Configs"} />
        <ConfigListContainer>
            {props.configs.map((config, index) => {
                switch (config.type) {
                    case "string":
                        return (
                            <ConfigContainer key={index}>
                                <DigitTextField
                                    value={config.value}
                                    outlined
                                    upperLabel={config.key}
                                    size={{
                                        width: "100%"
                                    }}
                                    onChange={e => props.onConfigChange(config.key, e.target.value)}
                                />
                            </ConfigContainer>
                        );
                    case "number":
                        return (
                            <ConfigContainer key={index}>
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
                            </ConfigContainer>
                        );
                    case "long_string":
                        return (
                            <ConfigContainer key={index}>
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
                            </ConfigContainer>
                        );
                    default:
                        console.log("Error, Unknown config type: " + config.type);
                        return <div />
                }
            })}
            <HLine />
            <DigitButton primary raised text={"Save"} size={{width: "100%"}}
                         onClick={() => props.onConfigSave(props.password, props.configs)} />
        </ConfigListContainer>
    </GeneralConfigContainer>
);
export default General;
