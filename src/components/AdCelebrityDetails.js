import { Button, FormControl, FormControlLabel, FormLabel, Radio, RadioGroup, TextField } from "@mui/material";
import { DatePicker, LocalizationProvider } from "@mui/x-date-pickers";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import axios from "axios";
import moment from "moment";
import { MuiTelInput } from "mui-tel-input";
import React, { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { authHeader } from "../util/Api";
import { REST_API } from "../util/EndPoints";
function AdCelebrityDetails() {

  const location = useLocation()
  const navigate = useNavigate()

  const [celebrityDetails, setCelebrityDetails] = useState({});
  const [phoneNumber, setPhoneNumber] = useState("");
  const [dateOfBirth, setDateOfBirth] = useState(null);


  useEffect(() => {
    if (location.state?.CelebrityDetails) {
      setCelebrityDetails(location.state?.CelebrityDetails)
    }
  }, [location])

  const changeHandler = (e) => {
    setCelebrityDetails((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const celebrity = { ...celebrityDetails, phoneNumber: phoneNumber, dateOfBirth: moment(dateOfBirth?.$d).format('L') }
    axios.post(`${REST_API}celebrity`, celebrity, {headers: authHeader()}).then((res) => {
      console.log(res.data);
      navigate('/celebrity-details')
    });
  };

  return (
    <div className="main" style={{ display: 'inline-block', marginLeft: '300px', width: '55%' }}>
      <p style={{ fontSize: "29px", margin: '2rem auto 1rem auto', textAlign: "center" }}>Add Celebrity Details</p><hr/>
      <form onSubmit={(e) => handleSubmit(e)}>
        <div className="row input-row" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', width: '1000px' }}>
          <div className="col-5 input-container">
            <input type="text" className="form-control input-field" placeholder="Enter Name" aria-label="Name" name="name" onChange={changeHandler} value={celebrityDetails?.name} required={true} />
          </div>
          <div className="col-5 input-container">
            <input type="text" className="form-control input-field" placeholder="Email" name="mailId"
              value={celebrityDetails?.mailId}
              onChange={changeHandler} aria-label="Email" required/>
          </div>
        </div>


        <div className="row input-row" style={{ display: 'flex', width: '1000px', marginLeft: '80px' }}>
          <div className="col-5 input-container">
            <MuiTelInput
              className="form-control input-field"
              // style={{width: '38rem'}}
              defaultCountry="IN"
              value={phoneNumber}
              onChange={(num) => setPhoneNumber(num)}
            />
          </div>
          <div className="col-5 input-container" style={{ width: '500px' }}>
            <textarea type="text" className="form-control input-field" placeholder="Address" name="address"
              value={celebrityDetails?.address}
              onChange={changeHandler} aria-label="Last name" />
          </div>
        </div>




        <div className="row input-row" style={{ display: 'flex  ', alignItems: 'center', justifyContent: 'center', width: '1000px' }}>

          <div className="col-5 input-container">
            <FormControl className="form-control input-field">
              <FormLabel id="demo-row-radio-buttons-group-label">
                Gender
              </FormLabel>
              <RadioGroup row aria-labelledby="demo-row-radio-buttons-group-label" name="gender" value={celebrityDetails?.gender} onChange={changeHandler}>
                <div style={{ marginRight: "23px" }}>
                  <FormControlLabel value="male" control={<Radio />} label="Male" />
                  <FormControlLabel value="female" control={<Radio />} label="Female" />
                  <FormControlLabel value="other" control={<Radio />} label="Other" />
                </div>
              </RadioGroup>
            </FormControl>
          </div>
          <div className="col-5 input-container">
            <LocalizationProvider dateAdapter={AdapterDayjs} >
              <DatePicker
                label="Date Of Birth"
                inputFormat="DD/MM/YYYY"
                value={dateOfBirth}
                onChange={(newValue) => {
                  setDateOfBirth(newValue);
                }}
                renderInput={(params) => <TextField {...params} />}
              />
            </LocalizationProvider>
          </div>
        </div>



        <div className="row input-row" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', width: '1000px' }}>
          <div className="col-5 input-container">
            <input type="text" className="form-control input-field" placeholder="Profession" aria-label="Profession" name="profession" onChange={changeHandler} value={celebrityDetails?.profession} />
          </div>
          <div className="col-5 input-container">
            <input type="text" className="form-control input-field" placeholder="Description" name="description"
              value={celebrityDetails?.description}
              onChange={changeHandler} aria-label="Last name" />
          </div>
        </div>

        <div className="row input-row">
          <div className="col" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', width: '1000px' }}>
            <Button type="submit" color="primary" variant="contained">
              Add Details
            </Button>
          </div>
        </div>


      </form>
    </div>
  )
}

export default AdCelebrityDetails