import React from "react";
import { TextField } from "@material-ui/core";

export const NumbersTextField = props => (
    <TextField
        defaultValue={props.defaultValue}
        label={props.label}
        value={props.value}
        onChange={event => {
            const val = event.target.value;
            if (isNaN(val) === false) {
                props.onChange(parseInt(val, 10));
            }
        }}
        variant="outlined"
    />
);

NumbersTextField.defaultProps = {
    defaultValue: 0,
    label: "NumberTextField",
    value: 0,
    onChange: val => {}
};

export default NumbersTextField;
