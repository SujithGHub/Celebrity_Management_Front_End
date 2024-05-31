import React, { useEffect } from "react";
import { TextField } from "@mui/material";


export const TextFieldInput = (props) => {

    useEffect(() => {}, [props])

    return (
        <TextField
                style={props.style}
                className={props.className}
                id="outlined-basic"
                label={props.label}
                name={props.name}
                required={props.required}
                value={props.value}
                onChange={props.onChange}
                error={props.error}
                variant={props.variant}
                onError={props.onError}
                helperText={props.helperText}
                type={props.inputType}
                readOnly={props.readOnly}
                inputProps={{
                    readOnly: props.readOnly
                }}
                // size="small"
              />
    )
}