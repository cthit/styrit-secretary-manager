import React from "react";
import {
  DigitForm,
  DigitButton,
  DigitText,
  DigitFormField
} from "@cthit/react-digit-components";
import * as yup from "yup";
import { CodeTextField } from "./Code.styles.screen";
import { FormContainer } from "../../../../common/ui/formcontainer/FormContainer.styles.jsx";

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
        {props.error && (
          <DigitText.Text text={props.error} color="error" bold />
        )}
        <DigitFormField
          name="code"
          component={CodeTextField}
          componentProps={{
            variant: "outlined",
            size: "medium",
            label: "Kod",
            style: { margin: "20px", minWidth: "325px" }
          }}
        />
        <DigitButton primary raised submit text="Nästa" />
      </FormContainer>
    )}
  />
);

export default Code;
