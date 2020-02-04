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
      console.log(values);
      // props.submitCode(values.code);
    }}
    initialValues={{ password: "" }}
    validationSchema={yup.object().shape({})}
    render={({ errors }) => (
      <FormContainer>
        {/*props.error && (
          <DigitText.Text text={props.error} color="error" bold />
        )*/}
        <InfoCard>
          <DigitText.Text text="Inloggning för sekreterare endast!" />
        </InfoCard>
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
