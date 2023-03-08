import ArrowBackIcon from '@mui/icons-material/ArrowBack';
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
import moment from "moment";
import React, { useEffect, useRef, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import axiosInstance from '../util/Interceptor';

export const AddCelebrityDetails = () => {
  const [celebrityDetails, setCelebrityDetails] = useState(null);
  const [image, setImage] = useState(null);
  const [value, setValue] = useState(null);
  const fileInputRef = useRef(null);

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
      if(location?.state?.CelebrityDetails?.image){
        const file = new File([location.state?.CelebrityDetails?.image], 'celebrity.jpeg', {type:'image/jpeg'});
        setImage(file);
      }
      setCelebrityDetails(location?.state?.CelebrityDetails)
    }
  },[location])


  const handleSubmit = (e) => {
    e.preventDefault();
    const celebrity = { ...celebrityDetails, dateOfBirth: moment(value?.$d).format('L') }
    const formData = new FormData();
    formData.append("file", image);
    formData.append("celebrity", JSON.stringify(celebrity));
    console.log(celebrity, "celebrity")
    axiosInstance.post(`/celebrity`, formData, {headers: {'Content-Type': "multipart/form-data"}} ).then((res) => {
      toast.success(celebrityDetails?.id ? celebrityDetails.name + " Updated" : "Details Added")
      navigate('/celebrity-details')
    })
  };

  return (
      <form className="container form-container" onSubmit={(e) => handleSubmit(e)} style={{ backgroundColor: "#f0f2f5", height: "100vh" }}>
        <div style={{width:'100%',display:'flex',flexDirection:'row',justifyContent:'space-around'}}>
        <h2 style={{ textAlign: "center" }} >  {celebrityDetails?.id?`Update ${celebrityDetails?.name}'s Details`:`Add Celebrity Details`}</h2>
        <Button onClick={()=>navigate("/celebrity-details")} title="Back" color="error"><ArrowBackIcon/></Button>
        </div>
        <div className="row">
          <div className="col">
            <TextField
              id="outlined-basic"
              label="Name"
              name="name"
              value={celebrityDetails?.name}
              onChange={(event) => changeHandler(event)}
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
              onChange={(event) => changeHandler(event)}
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
              onChange={(event) => changeHandler(event)}
              style={{ width: "400px " }}
            />

          </div>
          <div className="col">
            <TextField
              id="outlined-basic"
              label="Address"
              name="address"
              value={celebrityDetails?.address}
              onChange={(event) => changeHandler(event)}
              variant="outlined"
              style={{ width: "400px" }}
            />
          </div>
        </div>
        <div className="row" >
        <div className="col" style={{position: 'relative', left:'-11px',}}>
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
                renderInput={(params) => <TextField {...params} style={{width:"400px"}} />}
              />
            </LocalizationProvider>
          </div>
          <div className="col gender-field" >
            <FormControl style={{display: 'flex', flexDirection: 'row', justifyContent: 'space-evenly', alignItems: 'center', paddingTop: '5px'}}>
              <FormLabel id="demo-row-radio-buttons-group-label">
                Gender
              </FormLabel>
              <RadioGroup
                row
                aria-labelledby="demo-row-radio-buttons-group-label"
                name="gender"
                value={celebrityDetails?.gender}
                onChange={(event) => changeHandler(event)}
              >
                <div style={{ marginRight: "25px",width:"300px" }}>
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
              onChange={(event) => changeHandler(event)}
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
              onChange={(event) => changeHandler(event)}
              multiline
              maxRows={4}
            />
          </div>
        </div>

        <div className="row">
          <div className='col'>
            <input type='file' name='img' accept='.jpeg, .jpeg, .png' ref={fileInputRef}  onChange={(event) => setImage(event.target.files[0])} ></input>
          </div>
          <div className="col" >
          <FormControl >
            <FormLabel id="demo-row-radio-buttons-group-label">
              status
            </FormLabel>
            <RadioGroup
              row
              aria-labelledby="demo-row-radio-buttons-group-label"
              name="status"
              value={celebrityDetails?.status}
              onChange={(event) => changeHandler(event)}
            >
                <FormControlLabel
                  value="ACTIVE"
                  control={<Radio checked={celebrityDetails?.status === 'ACTIVE'} />}
                  label="ACTIVE"
                />
                <FormControlLabel
                  value="INACTIVE"
                  control={<Radio checked={celebrityDetails?.status === 'INACTIVE'} />}
                  label="INACTIVE"
                />
            </RadioGroup>
          </FormControl>
        </div>
        </div>
          <div className="row" >
            <Button type="submit" variant="contained">
             {celebrityDetails?.id ? "Update":" Add Details"}
            </Button>
          </div>
      </form>
  );
};