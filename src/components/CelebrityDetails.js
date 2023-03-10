import React, { useEffect, useState } from "react";
// import '../css/Admin.css'
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import BorderColorIcon from '@mui/icons-material/BorderColor';
import DeleteIcon from '@mui/icons-material/Delete';
import EventAvailableIcon from '@mui/icons-material/EventAvailable';
import SearchIcon from '@mui/icons-material/Search';
import { Button, CardActionArea, IconButton, InputAdornment, TextField, Tooltip } from "@mui/material";
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import CardMedia from "@mui/material/CardMedia";
import Typography from "@mui/material/Typography";
import _ from "lodash";
import { useNavigate } from "react-router-dom";
import axiosInstance from "../util/Interceptor";
import DeleteModal from "../util/DeleteModal";
import StatusDropDown from '../util/StatusDropDown';
import AddIcon from '@mui/icons-material/Add';

export const CelebrityDetails = () => {
  const navigate = useNavigate()
  const [celebrity, setCelebrity] = useState([]);
  const [filter, setFilter] = useState([]);
  const [search, setSearch] = useState([]);
  const [selectedCelebrity, setSelectedCelebrity] = useState(null)
  const [open, setOpen] = React.useState(false);
  const dropDownItem = ['ACTIVE', 'INACTIVE']
  const [available, setAvailable] = useState(false);
  const [blocked, setBlocked] = useState(false);
  const [availability, setAvailability] = useState([]);
  const [unavailability, setUnavailability] = useState([]);
  const [anchorEl, setAnchorEl] = useState(null);
  const [activeCelebrity, setActiveCelebrity] = useState([]);
  const [inactiveCelebrity, setInactiveCelebrity] = useState([]);
  const [active, setActive] = useState(true);
  
  const openMenu = Boolean(anchorEl);
  const label = { inputProps: { 'aria-label': 'Switch demo' } };


  const handleOpen = (cel) => {
    setOpen(true);
    setSelectedCelebrity(cel);
  }
  const handleClose = () => setOpen(false);

  useEffect(() => {
    getAllCelebrity();
  }, []);

  const getAllCelebrity = () => {
    axiosInstance.get(`/celebrity/get-all-celebrity`).then(res => {
      let result = _.orderBy(res, 'name')
      let activeFilter = _.filter(result, (res => res.status === "ACTIVE"))
      setActiveCelebrity(activeFilter)
      console.log(activeFilter, "act");
      let inactiveFilter = _.filter(result, (res => res.status === "INACTIVE"))
      setInactiveCelebrity(inactiveFilter)
      console.log(res, "res");

      setCelebrity(result);
      setFilter(result);
    })
  }

  const filterHandler = (e) => {
    const filterResults = filter.filter(item => item.name?.toLowerCase().includes(e.target.value.toLowerCase()))
    setCelebrity(filterResults)
    setSearch(e.target.value)
  }

  const deleteHandler = (id) => {
    axiosInstance.delete(`/celebrity/${id}`).then((res) => {
      getAllCelebrity();
    })
  }
  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };
  const handleMenuClose = (event, value) => {
    if (value === 'ACTIVE') {
      setActive(true);
    }
    else if (value === 'INACTIVE') {
      setActive(false);
    }
    setAnchorEl(null);
  }

  const deleteCelebrity = (celeb) => {
    setOpen(true);

  }

  const getActive = () => {
    return active ? activeCelebrity : inactiveCelebrity
  }


  return (
    <div className="home">
      <header className="header">
        <div style={{ display: "flex", justifyContent: "center" }}>
          <Button onClick={() => navigate("/enquiry-details")} color='error' title="Back"><ArrowBackIcon /></Button>
          <h3>Celebrity Details</h3>
        </div>

        <div>
          <TextField
            id="filled-search"
            className="text"
            onChange={(e) => filterHandler(e)}
            value={search}
            type="search"
            variant="outlined"
            placeholder="Search..."
            size="small"
            InputProps={{
              style: {
                borderRadius: '3rem'
              },
              startAdornment: (
                <InputAdornment position="start">
                  <SearchIcon />
                </InputAdornment>
              ),
            }}
          />
        </div>
        <div style={{ width: "15rem", display: "flex", justifyContent: "space-around" }}>
          <Button className="primary" variant="contained" title="Add celebrity" onClick={() => navigate('/add-celebrity-details')}><AddIcon /></Button>
          <StatusDropDown dropDownItem={dropDownItem} buttonName="Status" anchorEl={anchorEl} handleClick={handleClick} handleMenuClose={handleMenuClose} openMenu={openMenu} ></StatusDropDown>
        </div>

      </header>


      <div className="container" style={{ display: "flex", flexWrap: "wrap", maxWidth: "78rem", minHeight: 'calc(100vh - 251px)' }} >
        {getActive().map((celebrityItem, index) => (
          <Card sx={{ maxWidth: 345, width: 345, height: '515px', margin: "30px", overflowWrap: 'break-word' }} key={celebrityItem?.id} >
            <CardActionArea style={{ minHeight: '28rem' }} >
              <CardMedia
                component="img"
                height="130"
                src={`data:image/jpeg/png;base64,${celebrityItem?.base64Image}`}
                alt={celebrityItem?.name}
              />
              <CardContent className="scroll" style={{ height: '20rem', padding: '10px', overflow: 'auto', maxHight: '150px' }}>
                <Typography gutterBottom variant="h5" component="div" style={{ textAlign: 'center' }} >
                  {celebrityItem?.name}
                </Typography>
                <Typography variant="body2" color="text.secondary" style={{ textIndent: '1rem', minHeight: '5rem' }}>
                  {celebrityItem?.description}
                </Typography>
                <div style={{ padding: '10px 10px', wordBreak: 'break-all', minHeight: '9rem' }}>
                  <h6 className="celebrity-info"><span>DOB</span>: {celebrityItem?.dateOfBirth}</h6>
                  <h6 className="celebrity-info"><span>Gender</span>: {celebrityItem?.gender?.toUpperCase()}</h6>
                  <h6 className="celebrity-info"><span>Email</span>: {celebrityItem?.mailId}</h6>
                  <h6 className="celebrity-info"><span>Mobile</span>: {celebrityItem?.phoneNumber}</h6>
                  <h6 className="celebrity-info"><span>Address</span>: {celebrityItem?.address}</h6>
                </div>
              </CardContent>
            </CardActionArea>
            <div className='celebrity-container'>
              <Tooltip title='View Event Details'>
                <IconButton aria-label="delete" onClick={() => navigate('/event-details', { state: { c: celebrityItem } })}>
                  <EventAvailableIcon style={{ width: '25px', height: '25px' }} color="action" />
                </IconButton>
              </Tooltip>
              <Tooltip title='Edit'>
                <IconButton style={{ color: '#3f50b5' }} onClick={() => navigate('/add-celebrity-details', { state: { CelebrityDetails: celebrityItem } })}>
                  <BorderColorIcon />
                </IconButton>
              </Tooltip>
              <Tooltip title='Delete'>
                <IconButton style={{ color: 'red' }} onClick={() => handleOpen(celebrityItem)}>
                  <DeleteIcon />
                </IconButton>
              </Tooltip>
            </div>
          </Card>
        ))}
        {/* {active ? <div>
          <button style={{ width: '345px', height: '300px', background: '#FFF', margin: "30px" }} onClick={() => navigate('/add-celebrity-details')}><span style={{ fontSize: '100px' }}>+</span></button>
        </div> : ""
        } */}
      </div>

      <footer>Copyright @2023 </footer>
      <DeleteModal open={open} handleClose={handleClose} selectedCelebrity={selectedCelebrity} deleteHandler={deleteHandler}></DeleteModal>
    </div >
  );
};