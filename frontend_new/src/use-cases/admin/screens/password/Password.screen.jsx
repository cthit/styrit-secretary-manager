import React from "react";
import {
    DigitForm,
    DigitButton,
    DigitText,
    DigitFormField,
    DigitTextField
} from "@cthit/react-digit-components";
import * as yup from "yup";
import { FormContainer } from "../../../../common/ui/formcontainer/FormContainer.styles";
import { InfoCard, Space } from "./Password.styles.screen";

export const Password = props => (
    <DigitForm
        onSubmit={(values, actions) => {
            props.submitPassword(values.password);
        }}
        initialValues={{ password: "" }}
        validationSchema={yup.object().shape({})}
        render={({ errors }) => (
            <FormContainer>
                <InfoCard>
                    <DigitText.Text text="Inloggning för sekreterare endast!" />
                </InfoCard>
                {props.error && (
                    <DigitText.Text text={props.error} color="error" bold />
                )}
                <DigitFormField
                    name="password"
                    component={DigitTextField}
                    componentProps={{
                        outlined: true,
                        size: "medium",
                        password: true,
                        upperLabel: "Lösenord"
                    }}
                />
                <Space />
                <DigitButton primary raised submit text="Logga in" />
            </FormContainer>
        )}
    />
);

export default Password;
