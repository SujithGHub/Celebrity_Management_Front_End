import { TextField } from "@mui/material";
import { DateTimePicker, LocalizationProvider } from "@mui/x-date-pickers";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import React from "react";

export const DatePicker = (props) => {
  return (
    <LocalizationProvider dateAdapter={AdapterDayjs}>
      <DateTimePicker
        className={props.className}
        label={props.label}
        // InputProps={{size:"small"}}
        inputFormat={props.inputFormat}
        value={props.value}
        onChange={props.onChange}
        minDate={props.minDate}
        renderInput={(params) => <TextField required={props.required} {...params} helperText={props.helperText}/>}
      />
    </LocalizationProvider>
  );
};
