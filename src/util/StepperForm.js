import React, { useState } from "react";
import Box from "@mui/material/Box";
import Stepper from "@mui/material/Stepper";
import Step from "@mui/material/Step";
import StepLabel from "@mui/material/StepLabel";
import Button from "@mui/material/Button";
import Accordion from '@mui/material/Accordion';
import AccordionSummary from '@mui/material/AccordionSummary';
import AccordionDetails from '@mui/material/AccordionDetails';
import Typography from '@mui/material/Typography';
import FilterAltIcon from '@mui/icons-material/FilterAlt';
import ArrowDropDownIcon from '@mui/icons-material/ArrowDropDown';
import { TextFieldInput } from "../common/TextField";
import MultipleSelect from "../common/MultiSelectDropDown";
import { DatePicker } from "../common/DatePicker";
import { Autocomplete, Grid, TextField } from "@mui/material";
import "../css/StepperForm.css";
import { toast } from "react-toastify";
import moment from "moment/moment";
import { isEmpty, isValidMobileNo, getToken } from "./Validation";
import _ from "lodash";
import { useNavigate } from "react-router-dom";

const steps = ["Organization Details", "Event Details", "Celebrity Details"];

export const StepperForm = ({
  handleSubmit,
  enquiryDetails,
  celebrities,
  setCelebrityDetails,
  handleCelebrityChange,
  selectedCelebrities,
  handleClear,
  topics,
  selectedTopics,
  categories,
  getCelebrityBasedOnFilter,
  accordianExpanded,
  toggleAccordian,
  wait,
}) => {
  const [activeStep, setActiveStep] = useState(0);
  const [skipped, setSkipped] = useState(new Set());
  const [inputError, setInputError] = useState({
    organizationNameError: false,
    organizationNameErrorMessage: "",
    nameError: false,
    nameErrorMessage: "",
    mailIdError: false,
    mailIdErrorMessage: "",
    phoneNumberError: false,
    phoneNumberErrorMessage: ""
  });

  const navigate = useNavigate();

  const isStepOptional = (step) => {
    return step === 1;
  };

  const isStepSkipped = (step) => {
    return skipped.has(step);
  };

  function isValidEmail(email) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  }

  const handleNext = () => {
    if (activeStep === 0) {
      if (isEmpty(enquiryDetails?.organizationName)) {
        setInputError((prev) => ({
          ...prev,
          organizationNameError: true,
          organizationNameErrorMessage: "Organization Name is Required!",
        }));
        return;
      } else {
        setInputError((prev) => ({
          ...prev,
          organizationNameError: false,
          organizationNameErrorMessage: "",
        }));
      }

      if (_.isEmpty(enquiryDetails?.name)) {
        setInputError((prev) => ({
          ...prev,
          nameError: true,
          nameErrorMessage: "Organizer Name is Required!",
        }));
        return;
      } else {
        setInputError((prev) => ({
          ...prev,
          nameError: false,
          nameErrorMessage: "",
        }));
      }

      if (_.isEmpty(enquiryDetails?.mailId)) {
        setInputError((prev) => ({
          ...prev,
          mailIdError: true,
          mailIdErrorMessage: "Email is required",
        }));
        return;
      } else if (!isValidEmail(enquiryDetails?.mailId)) {
        setInputError((prev) => ({
          ...prev,
          mailIdError: true,
          mailIdErrorMessage: "Enter a valid email",
        }));
        return;
      } else {
        setInputError((prev) => ({
          ...prev,
          mailIdError: false,
          mailIdErrorMessage: "",
        }));
      }
      if (_.isEmpty(enquiryDetails?.phoneNumber)) {
        setInputError((prev) => ({
          ...prev,
          phoneNumberError: true,
          phoneNumberErrorMessage: "Mobile Number is Required",
        }));
        return;
      } else if (!isValidMobileNo(enquiryDetails.phoneNumber)) {
        setInputError((prev) => ({
          ...prev,
          phoneNumberError: true,
          phoneNumberErrorMessage: "Enter Valid Mobile Number",
        }));
        return;
      } else {
        setInputError((prev) => ({
          ...prev,
          phoneNumberError: false,
          phoneNumberErrorMessage: "",
        }));
      }
    }
    if (activeStep === 1) {
      if (enquiryDetails.startTime && enquiryDetails.endTime) {
        const startTime = new Date(enquiryDetails.startTime);
        const endTime = new Date(enquiryDetails.endTime);
        if (startTime >= endTime) {
          toast.info("End time must be greater than start time.");
          return;
        }
        const oneHr = new Date(startTime.getTime() + 60 * 60 * 1000);
        if (endTime < oneHr) {
          toast.info("Event must last at least one hour.");
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
    if(getToken() === null && activeStep === 0) {
      navigate("/book-now")
    }
    setActiveStep((prevActiveStep) => prevActiveStep - 1);
  };

  const handleSkip = () => {
    if (!isStepOptional(activeStep)) {
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
    }
     else if (key === "topic" || key === "category") {
      // if (key === "category") {
      //   handleClear();
      //   getCelebrityBasedOnFilter(newValue, key);
      // }
      setCelebrityDetails((prev) => ({ ...prev, [key]: newValue }));
    }
     else {
      let { name, value } = event?.target;
      value = value.trimStart();
      setInputError((prev) => ({ ...prev, [name + "Error"]: false, [name + "ErrorMessage"]: "" }));
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
    let durationString = "";
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
        value: enquiryDetails?.organizationName || "",
        name: "organizationName",
        helperText: inputError.organizationNameErrorMessage
      },
      {
        type: "TextField",
        label: "Contact Person Name",
        required: true,
        error: inputError.nameError,
        value: enquiryDetails?.name || "",
        name: "name",
        helperText: inputError.nameErrorMessage
      },
      {
        type: "TextField",
        label: "Email",
        required: true,
        error: inputError.mailIdError,
        value: enquiryDetails?.mailId || "",
        name: "mailId",
        inputType: "email",
        helperText: inputError.mailIdErrorMessage
      },
      {
        type: "TextField",
        label: "Contact Number",
        required: true,
        error: inputError.phoneNumberError,
        value: enquiryDetails?.phoneNumber || "",
        name: "phoneNumber",
        inputType: "number",
        helperText: inputError.phoneNumberErrorMessage
      },
    ],
    [
      {
        // 2 step
        type: "TextField",
        label: "Event Name",
        required: false,
        value: enquiryDetails?.eventName || "",
        name: "eventName",
      },
      {
        type: "TextField",
        label: "Venue",
        required: false,
        value: enquiryDetails?.venue || "",
        name: "venue",
      },
      {
        type: "DateField",
        label: "Start Time",
        required: false,
        value: enquiryDetails?.startTime || null,
        name: "startTime",
        minDate: new Date(),
        helperText: "Start",
        inputFormat: "DD/MM/YYYY hh:mm A",
        keyValue: "startTime",
      },
      {
        type: "DateField",
        label: "End Time",
        required: false,
        value: enquiryDetails?.endTime || null,
        name: "endTime",
        minDate: enquiryDetails?.startTime,
        helperText: "To",
        inputFormat: "DD/MM/YYYY hh:mm A",
        keyValue: "endTime",
      },
      {
        type: "TextField",
        label: "Event Duration",
        required: false,
        value: enquiryDetails?.duration || "",
        name: "duration",
        inputType: 'text',
        readOnly :true
      
      },
      {
        type: "TextField",
        label: "Budget",
        required: false,
        value: enquiryDetails?.budget || "",
        name: "budget",
        inputType: 'number',
      },
    ],
    [
      //3 step
      {
        type: 'AutoComplete',
        label: "Select Category",
        required: false,
        value: enquiryDetails?.category || "",
        options: categories,
        name: "category",
        keyName: 'category',
      },
      {
        type: "Multiselect",
        label: "Select Celebrity",
        required: false,
        value: enquiryDetails?.celebrityIds || "",
        name: "celebrityIds",
        keyName: "celebrityIds",
        data: celebrities,
        names: selectedCelebrities,
        handleCelebrityChange: handleCelebrityChange,
      },
      {
        type: "Multiselect",
        label: "Select Topics",
        required: false,
        value: enquiryDetails?.topics || "",
        name: "topics",
        keyName: "topics",
        data: topics,
        names: selectedTopics,
        handleCelebrityChange: handleCelebrityChange,
      },
      {
        type: "Multiselect",
        label: "Select Celebrity",
        required: false,
        value: enquiryDetails?.celebrityIds || "",
        name: "celebrityIds",
        keyName: "celebrityIds",
        data: celebrities,
        names: selectedCelebrities,
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
      <div className="col-5" style={{height: '5rem'}}>
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
          helperText={data.helperText}
          readOnly={data.readOnly}
        />
      </div>
    );
  };

  const renderStepContent = (activeStep) => {
    return (
      <Box sx={{ flexGrow: 1, marginTop: "2.5rem" }}>
        <Grid
          container
          spacing={2}
          minHeight={"22rem"}
          sx={{
            backgroundColor: "initial",
            boxShadow: "2",
            borderRadius: "0.5rem",
          }}
        >
          <div className="client-form-fields">
            {_.map(stepperJSON[activeStep], (stepper) => {
              if (stepper.type === "TextField") {
                return renderTextFieldInput(stepper);
              }
              if (stepper.type === "DateField") {
                return renderDatePickerInput(stepper);
              }
            })}
            {activeStep === 2 && (
              <>
                <div className="col-8">
                  <Accordion expanded={accordianExpanded}>
                    <AccordionSummary
                      onClick={toggleAccordian}
                      expandIcon={<ArrowDropDownIcon />}
                      aria-controls="panel2-content"
                      id="panel2-header"
                    >
                      <Typography>Filter by Category/Topic</Typography>
                    </AccordionSummary>
                    <AccordionDetails
                      sx={{
                        display: "flex",
                        alignItems: "center",
                        justifyItems: "center",
                      }}
                    >
                      <Autocomplete
                        disablePortal
                        id="combo-box-demo"
                        value={enquiryDetails?.category}
                        options={categories}
                        getOptionLabel={(options) => options?.name}
                        isOptionEqualToValue={(option, value) =>
                          option?.id === value?.id
                        }
                        name={"category"}
                        onChange={(event, newValue) =>
                          changeHandler(event, "category", newValue)
                        }
                        sx={{ width: 400 }}
                        renderInput={(params) => (
                          <TextField
                            {...params}
                            name="category"
                            label="Select Category"
                          />
                        )}
                      />
                      <MultipleSelect
                        className="client-form-field"
                        label={"Select Topics"}
                        data={topics}
                        names={selectedTopics}
                        keyName={"topics"}
                        handleChange={handleCelebrityChange}
                        handleClear={() => handleClear('topics')}
                      />
                      <Button
                        color="warning"
                        onClick={() => getCelebrityBasedOnFilter( enquiryDetails?.category, enquiryDetails?.topics ) }
                        variant="contained"
                      >
                        <FilterAltIcon />
                      </Button>
                    </AccordionDetails>
                  </Accordion>
                </div>
                {!accordianExpanded ? <div className="col-8" style={{display: 'flex', alignItems: 'center',}}>
                    <MultipleSelect
                      className="client-form-field"
                      label={"Select Celebrity"}
                      data={celebrities}
                      names={selectedCelebrities}
                      keyName={"celebrityIds"}
                      handleChange={handleCelebrityChange}
                      handleClear={() => handleClear("celebrityIds")}
                    />
                  <div style={{marginLeft: '2rem'}}>
                    {selectedCelebrities.map((value, index) => (
                      <div key={index}>
                        <span style={{fontWeight: 'bold', marginRight: '10px'}}>Choice {index + 1}: </span>{value.name}
                      </div>
                    ))}
                  </div>
                </div> : null}
              </>
            )}
          </div>
        </Grid>
      </Box>
    );
  };

  return (
    <div className="container" style={{marginTop: getToken() ? '1rem' : '3rem'}}>
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
            <div style={{ margin: "auto", minHeight: "calc(100vh - 20rem)", justifyItems: "center", }}>
              {renderStepContent(activeStep)}
            </div>
            <Box sx={{ display: "flex", flexDirection: "row", pt: 2 }}>
              <Button
                color="inherit"
                disabled={getToken() ? activeStep === 0 : false}
                onClick={() => handleBack()}
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
