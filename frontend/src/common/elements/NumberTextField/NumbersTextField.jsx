import React from "react";
import { DigitTextField } from "@cthit/react-digit-components";

export const NumbersTextField = props => (
    <DigitTextField
        upperLabel={props.label}
        value={props.value}
        onChange={event => {
            const val = event.target.value;
            if (isNaN(val) === false) {
                props.onChange(parseInt(val, 10));
            }
        }}
        outlined
    />
);

NumbersTextField.defaultProps = {
    label: "NumberTextField",
    value: 0,
    onChange: val => {
    }
};

export default NumbersTextField;
