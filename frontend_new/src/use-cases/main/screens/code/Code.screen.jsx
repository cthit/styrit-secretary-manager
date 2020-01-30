import React from "react";
import {
    DigitForm,
    DigitTextField,
    DigitFormField,
    DigitButton
} from "@cthit/react-digit-components";
import * as yup from "yup";
import { FormContainer } from "./Code.styles.screen";

export const Code = props => (
    <DigitForm
        onSubmit={(values, actions) => {
            props.submitCode(values.code);
        }}
        initialValues={{ code: "" }}
        validationSchema={yup.object().shape({
            code: yup.string().required("Koden kan inte vara tom.")
        })}
        render={({ errors }) => (
            <FormContainer>
                <DigitFormField
                    name="code"
                    component={DigitTextField}
                    componentProps={{
                        outlined: true,
                        upperLabel: "Kod"
                    }}
                />
                <DigitButton primary raised submit text="Nästa" />
            </FormContainer>
        )}
    />
);

export default Code;
