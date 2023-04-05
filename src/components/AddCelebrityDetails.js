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
import React, { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import axiosInstance from '../util/Interceptor';

export const AddCelebrityDetails = () => {

  const location = useLocation()
  const navigate = useNavigate()

  const CelebrityDetails = location?.state  

  const [celebrityDetails, setCelebrityDetails] = useState(null);
  const [image, setImage] = useState(null);
  const [value, setValue] = useState(null);


  const changeHandler = (e, key) => {
    // key === 'dateOfBirth' ? 
    // setCelebrityDetails((prev) => ({ ...prev,  'dateOfBirth' : moment(e?.$d).format('DD/MM/yyyy')})) 
    // :
    setCelebrityDetails((prev) => ({ ...prev, [e.target?.name]: e.target?.value, }));
  };

  useEffect(() => {
    if (CelebrityDetails) {
      if (CelebrityDetails?.CelebrityDetails?.image) {
        // const file = new File([location.state?.CelebrityDetails?.image], 'celebrity.jpeg', {type:'image/jpeg'});
        setImage(CelebrityDetails?.CelebrityDetails?.image);
      }
      setValue(CelebrityDetails?.CelebrityDetails?.dateOfBirth)
      setCelebrityDetails(CelebrityDetails?.CelebrityDetails)
    }
  }, [CelebrityDetails])


  const handleSubmit = (e) => {
    e.preventDefault();
    const celebrity = { ...celebrityDetails, dateOfBirth: new Date(value).getTime() }
    const formData = new FormData();
    formData.append("file", image);
    formData.append("celebrity", JSON.stringify(celebrity));
      axiosInstance.post(`/celebrity`, formData, { headers: { 'Content-Type': "multipart/form-data" } }).then((res) => {
        toast.success(celebrityDetails?.id ? celebrityDetails.name + " Updated" : "Details Added")
        navigate('/celebrity-details')
      })
  };

  return (
    <form className="container form-container" onSubmit={(e) => handleSubmit(e)} style={{ backgroundColor: "#f0f2f5", height: "100vh", marginTop: '1rem' }}>
      <div style={{ width: '100%', display: 'flex', flexDirection: 'row', justifyContent: 'space-around' }}>
        <h2 style={{ textAlign: "center" }} >  {celebrityDetails?.id ? `Update ${celebrityDetails?.name}'s Details` : `Add Celebrity Details`}</h2>
        <Button onClick={() => navigate("/celebrity-details")} title="Back" color="error"><ArrowBackIcon /></Button>
      </div>
      <div className="row">
        <div className="col">
          <TextField
            id="outlined-basic"
            label="Name"
            name="name"
            value={celebrityDetails?.name || ''}
            onChange={(event) => changeHandler(event, 'name')}
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
            value={celebrityDetails?.mailId || ''}
            onChange={(event) => changeHandler(event, 'mailId')}
            label="Mail Id"
            variant="outlined"
            style={{ width: "400px" }}
          />
        </div>
      </div>
      <div className="row">
        <div className="col">
          <TextField
            inputProps={{ maxLength: 10 }}
            id="outlined-basic"
            type='number'
            label="Phone Number"
            variant="outlined"
            name="phoneNumber"
            value={celebrityDetails?.phoneNumber || ''}
            required
            onChange={(event) => changeHandler(event, 'phoneNumber')}
            style={{ width: "400px " }}
          />

        </div>
        <div className="col">
          <TextField
            id="outlined-basic"
            label="Address"
            name="address"
            value={celebrityDetails?.address || ''}
            onChange={(event) => changeHandler(event, 'address')}
            variant="outlined"
            style={{ width: "400px" }}
          />
        </div>
      </div>
      <div className="row" >
        <div className="col" style={{ position: 'relative', left: '-11px', }}>
          <LocalizationProvider dateAdapter={AdapterDayjs}>
            <DatePicker
              label="Date Of Birth"
              value={value}
              inputFormat="DD/MM/YYYY"
              onChange={(newValue) => {
                setValue(new Date(newValue?.$d));
              }}
              renderInput={(params) => <TextField {...params} style={{ width: "400px" }} />}
            />
          </LocalizationProvider>
        </div>
        <div className="col gender-field" >
          <FormControl style={{ display: 'flex', flexDirection: 'row', justifyContent: 'space-evenly', alignItems: 'center', paddingTop: '5px' }}>
            <FormLabel id="demo-row-radio-buttons-group-label">
              Gender
            </FormLabel>
            <RadioGroup
              row
              aria-labelledby="demo-row-radio-buttons-group-label"
              name="gender"
              value={celebrityDetails?.gender || ''}
              onChange={(event) => changeHandler(event, 'gender')}
            >
              <div style={{ marginLeft: "20px", width: "300px" }}>
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
            value={celebrityDetails?.profession || ''}
            onChange={(event) => changeHandler(event, 'profession')}
            style={{ width: "400px" }}
          />
        </div>
        <div className="col">
          <TextField
            style={{ width: "400px" }}
            id="outlined-multiline-flexible"
            label="Description"
            name="description"
            value={celebrityDetails?.description || ''}
            onChange={(event) => changeHandler(event, 'description')}
            multiline
            maxRows={4}
          />
        </div>
      </div>

      <div className="row">
        <div className='col'>
          <input type='file' name='img' accept='.jpeg, .jpeg, .png' onChange={(event) => setImage(event.target.files[0])} ></input>
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
              value={celebrityDetails?.status || ''}
              onChange={(event) => changeHandler(event, 'status')}
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
          {celebrityDetails?.id ? "Update" : " Add Details"}
        </Button>
      </div>
    </form>
  );
};