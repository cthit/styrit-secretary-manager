import React from "react";
import { DigitButton, DigitForm, DigitText, DigitTextField, useDigitFormField } from "@cthit/react-digit-components";
import * as yup from "yup";
import { FormContainer } from "./Code.styles.screen";

const CodeField = () => {
    const fieldValues = useDigitFormField("code");
    return <DigitTextField {...fieldValues} size={{width: "325px"}} upperLabel="Kod" outlined medium
                           style={{marginBottom: "20px"}} />;
};


export const Code = props => (
    <DigitForm
        onSubmit={(values, actions) => {
            props.submitCode(values.code);
        }}
        initialValues={{code: ""}}
        validationSchema={yup.object().shape({
            code: yup.string().required("Koden kan inte vara tom.")
        })}
        render={({errors}) => (
            <FormContainer>
                {props.error && (
                    <DigitText.Text text={props.error} color="error" bold />
                )}
                <CodeField />
                <DigitButton primary raised submit text="Nästa" />
            </FormContainer>
        )}
    />
);

export default Code;
