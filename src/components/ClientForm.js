import { Autocomplete, ToggleButton, ToggleButtonGroup } from "@mui/material";
import Button from "@mui/material/Button";
import TextField from "@mui/material/TextField";
import { DateTimePicker } from "@mui/x-date-pickers";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import React, { useEffect, useState } from "react";
import { toast } from "react-toastify";
import axiosInstance from "../util/Interceptor";

export const ClientForm = () => {
  const [celebrityDetails, setCelebrityDetails] = useState({});
  const [actorName, setActorName] = useState([]);
  const [singleDay, setSingleDay] = useState(false);
  const [, setMultiDay] = useState(false);

  const [startTime, setStartTime] = useState(null);
  const [endTime, setEndTime] = useState(null);

  const changeHandler = (e) => {
    setCelebrityDetails((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };


  useEffect(() => {
    getAllCelebrity();
  }, []);


  const getAllCelebrity = () => {
    axiosInstance.get(`/celebrity/get-all-celebrity`).then((res) => {
        setActorName(res);
      })}

  const changeCelebrity = (value) => {
    setCelebrityDetails({ ...celebrityDetails, celebrity: value })
  }

  const handleSubmit = (e) => {
    e.preventDefault();
    const enquiryInfo = { ...celebrityDetails, startTime: startTime, endTime: endTime }
    console.log(enquiryInfo,"enquiryInfo");
    axiosInstance.post(`/enquiry`, enquiryInfo).then(res => {
      toast.success(res?.message);
      window.location.reload();
    })};

  const handleSingleDay = () => {
    setSingleDay(!singleDay)
    setStartTime(null)
    setMultiDay(false)
    setEndTime(null)
  }

  return (
    <div className="enquiry" >
      <div className="container" style={{ height: "100vh", textAlign: 'center', width: '100%' }}>
        <form className="container" onSubmit={(e) => handleSubmit(e)}>
          <p style={{ fontSize: "45px", paddingBottom: "15px", paddingTop: "15px", }} >
            Enquiry Form
          </p>
          <div className="row client-input">
            <div className="col">
              <TextField className='client-text-field'
                id="outlined-basic"
                label="Organization Name"
                name="organizationName"
                required
                value={celebrityDetails?.organizationName}
                onChange={(event) => changeHandler(event)}
                variant="outlined"

              />
            </div>
            <div className="col">
              <TextField className='client-text-field'
                id="outlined-basic"
                name="name"
                required
                value={celebrityDetails?.name}
                onChange={changeHandler}
                label="Contact Person Name"
                variant="outlined"
              />
            </div>
          </div>
          <div className="row client-input">
            <div className="col">
              <TextField className='client-text-field'
                id="outlined-basic"
                type={"email"}
                name="mailId"
                required
                value={celebrityDetails?.mailId}
                onChange={changeHandler}
                label="Mail Id"
                variant="outlined"
              />
            </div>
            <div className="col">
              {/* <MuiTelInput
              defaultCountry="IN"
              value={phoneNumber}
              name="phoneNumber"
              required
              onChange={(num) => setPhoneNumber(num)}
              style={{ width: "400px " }}
            /> */}
              <TextField className='client-text-field'
                id="outlined-basic"
                type="number"
                label="Contact Number"
                variant="outlined"
                name="phoneNumber"
                value={celebrityDetails?.phoneNumber}
                required
                onChange={changeHandler}
              />
            </div>
          </div>
          <div className="row client-input">

            <div className="col">
              <Autocomplete
                disablePortal
                getOptionLabel={(option) => option.name}
                id="combo-box-demo"
                options={actorName}
                required
                name="celebrity"
                onChange={(event, value) => changeCelebrity(value)}
                renderInput={(params) => <TextField {...params} label="Celebrity Name" style={{ width: '25rem' }} />}
              />
            </div>
            <div className="col" >
              <TextField className='client-text-field'
                id="outlined-basic"
                label="Event Type"
                variant="outlined"
                name="eventName"
                value={celebrityDetails?.eventName}
                required
                onChange={changeHandler}
              />
            </div>
          </div>
          <div className="row client-input">

            <div className="col">
              <TextField className='client-text-field'
                id="outlined-basic"
                name="location"
                required
                value={celebrityDetails?.location}
                onChange={changeHandler}
                label="Location"
                variant="outlined"
              />
            </div>
            <div className="col">
              <LocalizationProvider dateAdapter={AdapterDayjs}>
                <ToggleButtonGroup>
                  <ToggleButton value="web" onClick={() => handleSingleDay()} style={{ width: '25rem'}}  >Date and Time</ToggleButton>
                  {/* <ToggleButton value="android" onClick={() => handleMultiDay()}>Multi Day</ToggleButton> */}
                </ToggleButtonGroup>
                {singleDay ? <div>
                  <DateTimePicker
                    minDate={new Date()}
                    inputFormat="DD/MM/YYYY hh:mm A"
                    value={startTime}
                    onChange={(newValue) => setStartTime(newValue?.$d)}
                    renderInput={(params) => (
                      <TextField {...params} style={{width: '12.5rem'}} helperText="From" />
                    )}
                  />
                  <DateTimePicker
                    minDate={startTime}
                    inputFormat="DD/MM/YYYY hh:mm A"
                    value={endTime}
                    onChange={(newValue) => setEndTime(newValue?.$d)}
                    renderInput={(params) => (
                      <TextField {...params} style={{width: '12.5rem'}} helperText="To" />
                    )}
                  />
                </div> : ""}
              </LocalizationProvider>

            </div>

            {/* <div className="col-2" style={{ width: "213px" }}>
            <LocalizationProvider dateAdapter={AdapterDayjs}>
              {multiDay ? <div>
                <DateTimePicker
                  value={startTime}
                  onChange={(newValue) => setStartTime(newValue)}
                  renderInput={(params) => (
                    <TextField {...params} helperText="Start Date" />
                  )}
                />
                <DateTimePicker
                  value={endTime}
                  onChange={(newValue) => setEndTime(newValue)}
                  renderInput={(params) => (
                    <TextField {...params} helperText="End Date" />
                  )}
                />

              </div> : ""}
            </LocalizationProvider>
          </div> */}
          </div>
          <div className="row" style={{ paddingTop: "30px", display: 'flex', justifyContent: 'center' }}>
            <div className="col" >
              <Button type="submit" variant="contained" style={{ display: '' }}> SUBMIT </Button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};
