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
import _ from "lodash";
import React, { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import MultipleSelect from "../common/MultiSelectDropDown";
import axiosInstance from '../util/Interceptor';
import { getImagePath } from "../util/Validation";

const buttonStyle = {
  cursor: 'pointer',
  color: 'white',
  backgroundColor: 'gray',
  padding: '0.3rem 1rem',
  borderRadius: '4px',
  border: 'none',
  display: 'inline-block',
  textAlign: 'center',
  textDecoration: 'none',
  fontSize: '1rem',
  marginLeft:'2rem'
};

export const AddCelebrityDetails = () => {

  const location = useLocation()
  const navigate = useNavigate()

  const celebrity = location?.state

  const [celebrityDetails, setCelebrityDetails] = useState(null);
  const [categories, setCategories] = useState([]);
  const [updateImage, setUpdateImage] = useState(null);
  const [image, setImage] = useState(null);
  const [value, setValue] = useState(null);
  const [topic, setTopic] = useState([]);
  const [selectedCategories, setSelectedCategories] = useState([]);
  const [selectedTopics,setSelectedTopics]=useState([]);


  const changeHandler = (e) => {
    setCelebrityDetails((prev) => ({ ...prev, [e.target?.name]: e.target?.value, }));
  };

  const handleChange = (event, key) => {
    const selectedValue = event.target.value;
    const grouped = _.groupBy(selectedValue, 'id');
    const uniqueResult = _.flatMap(grouped, group => group.length === 1 ? group : []);
    const selectedIds = typeof uniqueResult === "string" ? uniqueResult.split(",") : uniqueResult;
    if (key === "categories" && selectedIds.length <= 3) {
      setSelectedCategories(selectedIds)
      setCelebrityDetails((prevDetails) => ({ ...prevDetails, [key]: selectedIds }));
    }
    if (key === "topics" && selectedIds.length <= 3) {
      setSelectedTopics(selectedIds)
      setCelebrityDetails((prevDetails) => ({ ...prevDetails, [key]: selectedIds }));
    }
  }

  const handleClear = (key) => {
    if (key === "categories") {
      setSelectedCategories([])
    } else {
      setSelectedTopics([])
    }
    setCelebrityDetails({...celebrityDetails, [key]: []})
  }


  useEffect(() => {
    if (celebrity) {
      const celebrityInfo = celebrity?.celebrity;
      if (celebrityInfo?.image) {
        setUpdateImage(celebrityInfo?.image);
      }
      setValue(celebrityInfo?.dateOfBirth);
      setCelebrityDetails(celebrityInfo);
      setSelectedCategories(celebrityInfo?.categories);
      setSelectedTopics(celebrityInfo?.topics);
      setCelebrityDetails((prev) => ({
        ...prev,
        status: celebrityInfo?.status ? celebrityInfo?.status : "ACTIVE",
      }));
    }
    getAllTopics();
    getAllCategories();
  }, [celebrity]);

  const getAllTopics = () => {
    axiosInstance.get(`/topics/get-all-topic`).then((res) => {
      setTopic(res);
    });
  };

  const getAllCategories = () => {
    axiosInstance.get(`/category/get-all-category`).then(res => {
      setCategories(res);
    }).catch(() => {})
  }
  const changeImageHandler = (event) => {
    const file = event?.target?.files[0];
    if (file?.size <= 100000) {
      setImage(event.target.files[0])
    } else {
      setImage(null)
      toast.error("File should be less than 100Kb")
    }
  }

  const handleSubmit = (e) => {
    e.preventDefault();
    const user = localStorage.getItem('user');
    const celebrity = { ...celebrityDetails, dateOfBirth: new Date(value).getTime(), user: user }
    const formData = new FormData();
    formData.append("file", image);
    formData.append("celebrity", JSON.stringify(celebrity));
    axiosInstance.post(`/celebrity`, formData, { headers: { 'Content-Type': "multipart/form-data" } }).then((res) => {
      toast.success(celebrityDetails?.id ? celebrityDetails.name + " Updated" : "Details Added")
      navigate('/celebrity-details')
    }).catch(() => {})
  };

  return (
    <form className="container form-container" onSubmit={(e) => handleSubmit(e)} style={{ backgroundColor: "#f0f2f5", height: "100vh"}}>
      <div style={{ width: '100%', display: 'flex', flexDirection: 'row', justifyContent: 'space-around' }}>
        <h2 style={{ textAlign: "center" }} >  {celebrityDetails?.id ? `Update ${celebrityDetails?.name}'s Details` : `Add Celebrity Details`}</h2>
        {/* <Button onClick={() => navigate("/celebrity-details")} title="Back" color="error"><ArrowBackIcon /></Button> */}
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
            label="Location"
            name="location"
            value={celebrityDetails?.location || ''}
            onChange={(event) => changeHandler(event, 'location')}
            variant="outlined"
            required
            style={{ width: "400px" }}
          />
        </div>
      </div>
      <div className="row" >
        <div className="col">
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
        <div className="col" >
        <TextField
            id="outlined-basic"
            label="Charges"
            name="charges"
            value={celebrityDetails?.charges || ''}
            onChange={(event) => changeHandler(event, 'charges')}
            variant="outlined"
            style={{ width: "400px" }}
          />
        </div>
      </div>
      <div className="row">
        <div className="col" >
            <MultipleSelect
            names={selectedCategories}
            label="Categories"
            name='categories'
            data={categories}
            width={400}
            handleChange={handleChange}
            handleClear={(e) => handleClear(e, 'categories')}
            keyName={"categories"}
          />
        </div>
        <div className="col" >
            <MultipleSelect 
            names={selectedTopics}
            label="Topics"
            name='topics'
            data={topic}
            handleChange={handleChange}
            handleClear={(e) => handleClear(e, 'topics')}
            keyName={"topics"}
          />
        </div>
      </div>

      <div className="row">
        <div className='col' style={{ display: 'flex', width: '400px', alignItems: 'center' }}>
          {image ? image?.name : <img src={ updateImage ? getImagePath(updateImage) : image } alt={celebrityDetails?.name} width='100px' height='100px'></img> }
          <div style={{ paddingLeft: '1rem' }}>
            <input type='file' name='img' accept='.jpeg, .jpg, .png' onChange={(event) => changeImageHandler(event)} style={{ display: 'none' }} id="fileInput" />
            <label htmlFor="fileInput" style={buttonStyle} >
             {(celebrityDetails?.name || image) ? "Update" : "Upload"}
            </label>
          </div>
        </div>
        <div className="col" style={{ width: '400px' }}>
          <FormControl style={{display:'flex', flexDirection: 'row', justifyContent: 'center', alignItems: 'center', height: '6rem'}}>
            <FormLabel id="demo-row-radio-buttons-group-label" style={{width: '3rem', marginRight: '2rem'}}>
              Status
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
                label="Active"
              />
              <FormControlLabel
                value="INACTIVE"
                control={<Radio checked={celebrityDetails?.status === 'INACTIVE'} />}
                label="InActive"
              />
            </RadioGroup>
          </FormControl>
        </div>
      </div>
      <div className="row" style={{width: '50%', display:'flex', flexDirection: 'row', flexWrap: 'nowrap', justifyContent: 'center'}}>
              <Button style={{width: '5rem', marginRight: '2rem'}} type="submit" variant="contained"> {celebrityDetails?.id ? "Update" : " Add"} </Button>
              <Button style={{width: '5rem'}} onClick={() => navigate(celebrityDetails?.id ? `/celebrity-profile/${celebrityDetails?.id}` : '/celebrity-details')} variant="contained" color="error">Back</Button>
      </div>
    </form>
  );
};