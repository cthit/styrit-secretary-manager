import React from "react";
import {DigitButton, DigitForm, DigitText, DigitTextField, useDigitFormField} from "@cthit/react-digit-components";
import * as yup from "yup";
import {FormContainer} from "../../../../common/ui/formcontainer/FormContainer.styles";
import {InfoCard, Space} from "./Password.styles.screen";

const PasswordField = () => {
    const fieldValues = useDigitFormField("password");
    return <DigitTextField {...fieldValues} upperLabel="Lösenord" outlined medium password/>;
};

export const Password = props => (
    <DigitForm
        onSubmit={(values, actions) => {
            props.submitPassword(values.password);
        }}
        initialValues={{password: ""}}
        validationSchema={yup.object().shape({})}
        render={({errors}) => (
            <FormContainer>
                <InfoCard>
                    <DigitText.Text text="Inloggning för sekreterare endast!"/>
                </InfoCard>
                {props.error && (
                    <DigitText.Text text={props.error} color="error" bold/>
                )}
                <PasswordField/>
                <Space/>
                <DigitButton primary raised submit text="Logga in"/>
            </FormContainer>
        )}
    />
);

export default Password;
