import Button from "@mui/material/Button";
import FormControl from "@mui/material/FormControl";
import FormControlLabel from "@mui/material/FormControlLabel";
import FormLabel from "@mui/material/FormLabel";
import Radio from "@mui/material/Radio";
import RadioGroup from "@mui/material/RadioGroup";
import TextField from "@mui/material/TextField";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import axios from "axios";
import moment from "moment";
import { MuiTelInput } from "mui-tel-input";
import React, { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { authHeader, errorHandler } from "../util/Api";
import { REST_API } from "../util/EndPoints";
import { isValidMobileNo } from "../util/Validation";


export const AddCelebrityDetails = () => {
  const [celebrityDetails, setCelebrityDetails] = useState({});
  const [phoneNumber, setPhoneNumber] = useState("");

  const location=useLocation()
  const navigate=useNavigate()

  const changeHandler = (e) => {
  
    setCelebrityDetails((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  useEffect(()=>{
    if(location?.state?.CelebrityDetails){
      console.log(location?.state?.CelebrityDetails)
      setCelebrityDetails(location?.state?.CelebrityDetails)
    }
  },[location])

  const [value, setValue] = useState(null);

  const handleSubmit = (e) => {
    e.preventDefault();
    // if(isValidMobileNo(celebrityDetails?.phoneNumber)){
      const celebrity = { ...celebrityDetails, dateOfBirth: moment(value?.$d).format('L') }
      axios.post(`${REST_API}/celebrity`, celebrity, { headers: authHeader() }).then((res) => {
        console.log(res.data, "response");
        navigate('/celebrity-details')
      }).catch(error => {
        errorHandler(error);
      })
    // }
    // window.alert("Invalid")
  };   

  return (
      <form className="container form-container" onSubmit={(e) => handleSubmit(e)} style={{ backgroundColor: "#f0f2f5", height: "100vh" }}>
        <h2 style={{ textAlign: "center" }} >  {celebrityDetails?.id?`Update ${celebrityDetails?.name}'s Details`:`Add Celebrity Details`}</h2>
        <div className="row">
          <div className="col">
            <TextField
              id="outlined-basic"
              label="Name"
              name="name"
              value={celebrityDetails?.name}
              onChange={changeHandler}
              variant="outlined"
              required
              style={{ width: "400px" }}
            />
          </div>
          <div className="col">
            <TextField
              id="outlined-basic"
              type={"email"}
              name="mailId"
              required
              value={celebrityDetails?.mailId}
              onChange={changeHandler}
              label="Mail Id"
              variant="outlined"
              style={{ width: "400px" }}
            />
          </div>
        </div>
        <div className="row">
          <div className="col">
          
            {/* <MuiTelInput
              defaultCountry="IN"
              value={celebrityDetails?.phoneNumber ? celebrityDetails?.phoneNumber : phoneNumber}
              onChange={(num) => setPhoneNumber(num)}
              style={{ width: "400px " }}
              required
            /> */}
            <TextField
              inputProps={{ maxLength : 10}}
              id="outlined-basic"
              type='number'
              label="Phone Number"
              variant="outlined"
              name="phoneNumber"
              value={celebrityDetails?.phoneNumber}
              required
              onChange={changeHandler}
              style={{ width: "400px " }}
            />

          </div>
          <div className="col">
            <TextField
              id="outlined-basic"
              label="Address"
              name="address"
              value={celebrityDetails?.address}
              onChange={changeHandler}
              variant="outlined"
              style={{ width: "400px" }}
            />
          </div>
        </div>
        <div className="row">
        <div className="col" style={{position: 'relative', left:'-11px'}}>
            <LocalizationProvider 
            dateAdapter={AdapterDayjs} 
            >
              <DatePicker
                label="Date Of Birth"
                inputFormat="DD/MM/YYYY"
                value={celebrityDetails?.dateOfBirth ?  celebrityDetails?.dateOfBirth : value}
                onChange={(value) => {
                  setValue(value)
                }}
                renderInput={(params) => <TextField {...params} />}
              />
            </LocalizationProvider>
          </div>
          <div className="col gender-field">
            <FormControl style={{display: 'flex', flexDirection: 'row', justifyContent: 'space-evenly', alignItems: 'center', paddingTop: '5px'}}>
              <FormLabel id="demo-row-radio-buttons-group-label">
                Gender
              </FormLabel>
              <RadioGroup
                row
                aria-labelledby="demo-row-radio-buttons-group-label"
                name="gender"
                value={celebrityDetails?.gender}
                onChange={changeHandler}
              >
                <div style={{ marginRight: "23px" }}>
                  <FormControlLabel
                    value="male"
                    control={<Radio checked={celebrityDetails?.gender === 'male'} />}
                    label="Male"
                  />
                  <FormControlLabel
                    value="female"
                    control={<Radio checked={celebrityDetails?.gender === 'female'} />}
                    label="Female"
                  />
                  <FormControlLabel
                    value="other"
                    control={<Radio checked={celebrityDetails?.gender === 'other'} />}
                    label="Other"
                  />
                </div>
              </RadioGroup>
            </FormControl>
          </div>
        </div>
        <div className="row" style={{ maxHeight: "98px" }}>
          <div className="col">
            <TextField
              id="outlined-basic"
              label="Profession"
              variant="outlined"
              name="profession"
              value={celebrityDetails?.profession}
              onChange={changeHandler}
              style={{ width: "400px" }}
            />
          </div>
          <div className="col">
            <TextField
              style={{ width: "400px" }}
              id="outlined-multiline-flexible"
              label="Description"
              name="description"
              value={celebrityDetails?.description}
              onChange={changeHandler}
              multiline
              maxRows={4}
            />
          </div>
        </div>

        <div className="row">
          <div className="col" style={{ display: "flex", alignItems: "flex-end" }} >
            <Button type="submit" variant="contained">
             {celebrityDetails?.id?"update":" Add Details"}
            </Button>
          </div>
        </div>
      </form>
  );
};