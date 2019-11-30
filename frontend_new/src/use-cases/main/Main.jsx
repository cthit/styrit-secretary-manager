import React, { Component } from "react";
import {
    DigitForm,
    DigitTextField,
    DigitFormField,
    DigitButton
} from "@cthit/react-digit-components";
import * as yup from "yup";

class Main extends Component {
    render() {
        return (
            <DigitForm
                onSubmit={(values, actions) => {
                    console.log(values);
                }}
                initialValues={{ code: "" }}
                validationSchema={yup.object().shape({
                    code: yup.string().required("Koden kan inte vara tom.")
                })}
                render={({ errors }) => (
                    <div>
                        <DigitFormField
                            name="code"
                            component={DigitTextField}
                            componentProps={{
                                outlined: true,
                                upperLabel: "Kod"
                            }}
                        />
                        <DigitButton primary raised submit text="Nästa" />
                    </div>
                )}
            />
        );
    }
}

export default Main;

/*
    <DigitDesign.Card absWidth="300px" absHeight="300px">
      <DigitDesign.CardBody>
        <DigitFormField
          name="text"
          component={DigitTextField}
          componentProps={{
            upperLabel: "Hej"
          }}
        />
        <DigitFormField
          name="agreement"
          component={DigitCheckbox}
          componentProps={{ primary: true, label="Agreement" }}
        />
      </DigitDesign.CardBody>
      <DigitDesign.CardButtons>
        <DigitButton primary raised submit text="Dummy submit" />
      </DigitDesign.CardButtons>
    </DigitDesign.Card>
  )}
/>;
*/
