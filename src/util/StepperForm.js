import React, { useState } from "react";
import Box from "@mui/material/Box";
import Stepper from "@mui/material/Stepper";
import Step from "@mui/material/Step";
import StepLabel from "@mui/material/StepLabel";
import Button from "@mui/material/Button";
import Typography from "@mui/material/Typography";
import { TextFieldInput } from "../common/TextField";
import MultipleSelect from "../common/MultiSelectDropDown";
import { DatePicker } from "../common/DatePicker";
import { Autocomplete, Grid, TextField } from "@mui/material";
import "../css/StepperForm.css";
import _, { isEmpty } from "lodash";
import { toast } from "react-toastify";
import moment, { duration } from "moment/moment";

const steps = ["Organization Details", "Event Details", "Celebrity Details"];

export const StepperForm = ({
  handleSubmit,
  celebrityDetails,
  celebrities,
  setCelebrityDetails,
  handleCelebrityChange,
  selectedCelebrities,
  handleClear,
  topics,
  selectedTopics,
  categories,
  getCelebrityBasedOnCat,
  wait
}) => {
  const [activeStep, setActiveStep] = useState(0);
  const [skipped, setSkipped] = useState(new Set());
  const [inputError, setInputError] = useState({
    organizationNameError: false,
    organizerNameError: false,
    mailIdError: false,
    phoneNumberError: false,
  });

  const isStepOptional = (step) => {
    return step === 1;
  };

  const isStepSkipped = (step) => {
    return skipped.has(step);
  };

  const handleNext = () => {
    if (activeStep === 0) {
      if (isEmpty(celebrityDetails?.organizationName)) {
        setInputError((prev) => ({ ...prev, organizationNameError: true }));
        return;
      } else {
        setInputError((prev) => ({ ...prev, organizationNameError: false }));
      }

      if (isEmpty(celebrityDetails?.name)) {
        setInputError((prev) => ({ ...prev, organizerNameError: true }));
        return;
      } else {
        setInputError((prev) => ({ ...prev, organizerNameError: false }));
      }

      if (isEmpty(celebrityDetails?.mailId)) {
        setInputError((prev) => ({ ...prev, mailIdError: true }));
        return;
      } else {
        setInputError((prev) => ({ ...prev, mailIdError: false }));
      }
      if (isEmpty(celebrityDetails?.phoneNumber)) {
        setInputError((prev) => ({ ...prev, phoneNumberError: true }));
        return;
      } else {
        setInputError((prev) => ({ ...prev, phoneNumberError: false }));
      }
    }
    if (activeStep === 1) {
      if (celebrityDetails.startTime && celebrityDetails.endTime) {
        const startTime = new Date(celebrityDetails.startTime);
        const endTime = new Date(celebrityDetails.endTime);
        if (startTime >= endTime) {
          toast.info("End time must be greater than start time.");
          return;
        }
        const oneHr = new Date(startTime.getTime() + 60 * 60 * 1000);
        if (endTime < oneHr) {
          toast.info("End time must be One hour greater than start time.");
          return;
        }
      }
    }

    let newSkipped = skipped;
    if (isStepSkipped(activeStep)) {
      newSkipped = new Set(newSkipped.values());
      newSkipped.delete(activeStep);
    }
    setActiveStep((prevActiveStep) => prevActiveStep + 1);
    setSkipped(newSkipped);
  };

  const handleBack = () => {
    setActiveStep((prevActiveStep) => prevActiveStep - 1);
  };

  const handleSkip = () => {
    if (!isStepOptional(activeStep)) {
      // You probably want to guard against something like this,
      // it should never occur unless someone's actively trying to break something.
      throw new Error("You can't skip a step that isn't optional.");
    }

    setActiveStep((prevActiveStep) => prevActiveStep + 1);
    setSkipped((prevSkipped) => {
      const newSkipped = new Set(prevSkipped.values());
      newSkipped.add(activeStep);
      return newSkipped;
    });
  };

  const handleReset = () => {
    setActiveStep(0);
  };

 
  const changeHandler = (event, key, newValue) => {
    if (key === "startTime" || key === "endTime") {
      const updatedValue = event?.$d;
      setCelebrityDetails((prev) => {
        const newDetails = { ...prev, [key]: updatedValue };
        if (newDetails.startTime && newDetails.endTime) {
          newDetails.duration = calculateDuration(newDetails.startTime, newDetails.endTime);
        }
        return newDetails;
      });
    } else if (key === "topic" || key === "category") {
      if (key === "category") {
        handleClear();
        getCelebrityBasedOnCat(newValue);
      }
      setCelebrityDetails((prev) => ({ ...prev, [key]: newValue }));
    } else {
      const { name, value } = event?.target;
      setCelebrityDetails((prev) => ({ ...prev, [name]: value }));
    }
  };

  const calculateDuration = (startTime, endTime) => {
    const startDate = moment(startTime, "MM/DD/YYYY HH:mm:ss");
    const endDate = moment(endTime, "MM/DD/YYYY HH:mm:ss");

    const diffMilliseconds = endDate.diff(startDate);

    const timeDifferenceInSeconds = diffMilliseconds / 1000;

    const days = Math.floor(timeDifferenceInSeconds / (3600 * 24));
    const hours = Math.floor((timeDifferenceInSeconds % (3600 * 24)) / 3600);
    const minutes = Math.floor((timeDifferenceInSeconds % 3600) / 60);

    let durationString = '';
    if (days > 0) {
      durationString += `${days} days `;
    }
    if (hours > 0) {
      durationString += `${hours} hours `;
    }
    if (minutes > 0) {
      durationString += `${minutes} minutes`;
    }

    return durationString.trim();
  };

  const stepperJSON = [
    [
      {
        // 1 step
        type: "TextField",
        label: "Organization Name",
        required: true,
        error: inputError.organizationNameError,
        value: celebrityDetails?.organizationName || "",
        name: "organizationName",
      },
      {
        type: "TextField",
        label: "Contact Person Name",
        required: true,
        error: inputError.organizerNameError,
        value: celebrityDetails?.name || "",
        name: "name",
      },
      {
        type: "TextField",
        label: "Email",
        required: true,
        error: inputError.mailIdError,
        value: celebrityDetails?.mailId || "",
        name: "mailId",
        inputType: "email",
      },
      {
        type: "TextField",
        label: "Contact Number",
        required: true,
        error: inputError.phoneNumberError,
        value: celebrityDetails?.phoneNumber || "",
        name: "phoneNumber",
        inputType: "number",
      },
    ],
    [
      {
        // 2 step
        type: "TextField",
        label: "Event Name",
        required: true,
        value: celebrityDetails?.eventName || "",
        name: "eventName",
      },
      {
        type: "TextField",
        label: "Venue",
        required: true,
        value: celebrityDetails?.venue || "",
        name: "venue",
      },
      {
        type: "DateField",
        label: "Start Time",
        required: true,
        value: celebrityDetails?.startTime || null,
        name: "startTime",
        minDate: new Date(),
        helperText: "Start",
        inputFormat: "DD/MM/YYYY hh:mm A",
        keyValue: "startTime",
      },
      {
        type: "DateField",
        label: "End Time",
        required: true,
        value: celebrityDetails?.endTime || null,
        name: "endTime",
        minDate: celebrityDetails?.startTime,
        helperText: "To",
        inputFormat: "DD/MM/YYYY hh:mm A",
        keyValue: "endTime",
      },
      {
        type: "TextField",
        label: "Event Duration",
        required: true,
        value: celebrityDetails?.duration || "",
        name: "duration",
        inputType: 'text',
        readOnly :true
      
      },
      {
        type: "TextField",
        label: "Budget",
        required: true,
        value: celebrityDetails?.budget || "",
        name: "budget",
        inputType: 'number',
      },
    ],
    [
      //3 step
      {
        type: 'AutoComplete',
        label: "Select Category",
        required: true,
        value: celebrityDetails?.category || "",
        options: categories,
        name: "category",
        keyName: 'category',
      },
      {
        type: "Multiselect",
        label: "Select Celebrity",
        required: true,
        value: celebrityDetails?.celebrityIds || "",
        name: "celebrityIds",
        keyName: "celebrityIds",
        data: celebrities,
        names: selectedCelebrities,
        handleCelebrityChange: handleCelebrityChange,
      },
      {
        type: "Multiselect",
        label: "Select Topics",
        required: true,
        value: celebrityDetails?.topics || "",
        name: "topics",
        keyName: "topics",
        data: topics,
        names: selectedTopics,
        handleCelebrityChange: handleCelebrityChange,
      },
    ],
  ];

  const renderDatePickerInput = (data) => {
    return (
      <div className="col-5">
        <DatePicker
          className="client-text-field"
          label={data.label}
          inputFormat={data.inputFormat}
          minDate={data.minDate}
          value={data.value || null}
          onChange={(event) => changeHandler(event, data.keyValue)}
          helperText={data.helperText}
        />
      </div>
    );
  };

  const renderTextFieldInput = (data) => {
    return (
      <div className="col-5">
        <TextFieldInput
          className="client-text-field"
          label={data.label}
          name={data.name}
          required={data.required}
          error={data.error}
          value={data.value}
          onChange={(eve) => changeHandler(eve)}
          inputType={data.inputType ? data.inputType : "text"}
          variant="outlined"
          readOnly={data.readOnly}
        />
      </div>
    );
  };

  const renderMultiSelect = (data) => {
    return (
      <div className="col-5">
        <MultipleSelect
          className="client-form-field"
          label={data.label}
          data={data.data}
          names={data.names} // state to hold the selected celebrity names
          setNames={data.setSelectedCelebrityNames} // passing the setState of celebrity names
          keyName={data.keyName}
          handleChange={data.handleCelebrityChange}
          handleClear={handleClear}
        />
      </div>
    );
  };

  const renderAutoComplete = (data) => {
    return (
      <div className="col-5">
        <Autocomplete
          disablePortal
          id="combo-box-demo"
          value={data.value || null}
          options={data.options}
          getOptionLabel={(options) => options.name || ""}
          isOptionEqualToValue={(option, value) => option.id === value.id}
          name={data.name}
          onChange={(event, newValue) =>
            changeHandler(event, "category", newValue)
          }
          sx={{ width: 300 }}
          renderInput={(params) => (
            <TextField {...params} name="category" label="Category" />
          )}
        />
      </div>
    );
  };

  const renderStepContent = (activeStep) => {
    return (
      <Box sx={{ flexGrow: 1,marginTop:"2.5rem" }}>
        <Grid container spacing={2} minHeight={290} sx={{backgroundColor:"initial",boxShadow:"2",borderRadius:"0.5rem",}}>
          <div className="client-form-fields">
            {_.map(stepperJSON[activeStep], (stepper) => {
              if (stepper.type === "TextField") {
                return renderTextFieldInput(stepper);
              }
              if (stepper.type === "DateField") {
                return renderDatePickerInput(stepper);
              }
              if (stepper.type === "Multiselect") {
                return renderMultiSelect(stepper);
              }
              if (stepper.type === "AutoComplete") {
                return renderAutoComplete(stepper);
              }
            })}
          </div>
        </Grid>
      </Box>
    );
  };

  return (
    <div className="container" style={{ marginTop: "2rem" }}>
      <Box sx={{ width: "100%" }}>
        <Stepper activeStep={activeStep}>
          {steps.map((label, index) => {
            const stepProps = {};
            const labelProps = {};
            if (isStepOptional(index)) {
              labelProps.optional = (
                <Typography variant="caption">Optional</Typography>
              );
            }
            if (isStepSkipped(index)) {
              stepProps.completed = false;
            }
            return (
              <Step key={label} {...stepProps}>
                <StepLabel {...labelProps}>{label}</StepLabel>
              </Step>
            );
          })}
        </Stepper>
        {activeStep === steps.length ? (
          <React.Fragment>
            <Typography sx={{ mt: 2, mb: 1 }}>
              All steps completed - you&apos;re finished
            </Typography>
            <Box sx={{ display: "flex", flexDirection: "row", pt: 2 }}>
              <Box sx={{ flex: "1 1 auto" }} />
              <Button onClick={handleReset}>Reset</Button>
            </Box>
          </React.Fragment>
        ) : (
          <React.Fragment>
            <Typography sx={{ mt: 2, mb: 1 }}>Step {activeStep + 1}</Typography>
            <div
              style={{
                margin: "auto",
                //   display: "flex",
                minHeight: "calc(100vh - 20rem)",
                justifyItems: "center",
              }}
            >
              {renderStepContent(activeStep)}
            </div>
            <Box sx={{ display: "flex", flexDirection: "row", pt: 2 }}>
              <Button
                color="inherit"
                disabled={activeStep === 0}
                onClick={handleBack}
                sx={{ mr: 1 }}
              >
                Back
              </Button>
              <Box sx={{ flex: "1 1 auto" }} />
              {isStepOptional(activeStep) && (
              <Button color="inherit" onClick={handleSkip} sx={{ mr: 1 }}>
                Skip
              </Button>
            )}

              <Button disabled={wait}
                onClick={
                  activeStep === steps.length - 1 ? handleSubmit : handleNext
                }
              >
                {activeStep === steps.length - 1 ? "Finish" : "Next"}
              </Button>
            </Box>
          </React.Fragment>
        )}
      </Box>
    </div>
  );
};
