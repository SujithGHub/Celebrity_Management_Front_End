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

  return (
    <div className="home">
      <header className="header">
        <h3>Celebrity Details</h3>
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
                borderRadius: '3rem'},
              startAdornment: (
                <InputAdornment position="start">
                  <SearchIcon />
                </InputAdornment>
              ),
            }}
          />
          <Button onClick={() => navigate("/enquiry-details")} color='error' title="Back"><ArrowBackIcon/></Button>
        </div>
      </header>
        <div className="container" style={{ display: "flex", flexWrap: "wrap", maxWidth: "78rem" }} >
          {celebrity.map((celebrityItem, index) => (
            <Card sx={{ maxWidth: 345, width: 345, height: '515px', margin: "30px", overflowWrap: 'break-word' }} key={celebrityItem?.id} >
              <CardActionArea style={{minHeight: '28rem'}} >
                <CardMedia
                  component="img"
                  height="130"
                  src={`data:image/jpeg/png;base64,${celebrityItem?.base64Image}`}
                  alt={celebrityItem?.name}
                />
                <CardContent className="scroll" style={{ height: '20rem', padding: '10px', overflow: 'auto',maxHight: '150px' }}>
                  <Typography gutterBottom variant="h5" component="div" style={{ textAlign: 'center' }} >
                    {celebrityItem?.name}
                  </Typography>
                  <Typography variant="body2" color="text.secondary" style={{ textIndent: '1rem', minHeight: '5rem' }}>
                    {celebrityItem?.description}
                  </Typography>
                <div style={{ padding: '10px 10px', wordBreak:'break-all', minHeight: '9rem' }}>
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
                      <EventAvailableIcon style={{width: '25px', height: '25px'}} color="action" />
                  </IconButton>
                </Tooltip>
                <Tooltip title='Edit'>
                  <IconButton style={{ color: '#3f50b5' }} onClick={() => navigate('/add-celebrity-details', { state: { CelebrityDetails: celebrityItem } })}>
                    <BorderColorIcon />
                  </IconButton>
                </Tooltip>
                <Tooltip title='Delete'>
                  <IconButton style={{ color: 'red' }} onClick={() => deleteHandler(celebrityItem?.id)}>
                    <DeleteIcon />
                  </IconButton>
                </Tooltip>
              </div>
            </Card>
          ))}
          <div>
            <button style={{ width: '345px', height: '300px', background: '#FFF', margin: "30px" }} onClick={() => navigate('/add-celebrity-details')}><span style={{ fontSize: '100px' }}>+</span></button>
          </div>
        </div>
      {/* <div>
          <Button className="primary" variant="contained" onClick={() => handleDay('single')}></Button>
          <Button className="primary" variant="contained" onClick={() => handleDay('multiple')}></Button>
          {(single) ? 
            <div>
              <TextField placeholder="Single"/>
            </div>
            : 
            <div>
              <TextField placeholder="Multiple"/>
            </div> 
            }
        </div> */}
      <footer>Copyright @2023 </footer>
      <DeleteModal open={open} handleClose={handleClose} selectedCelebrity={selectedCelebrity} deleteHandler={deleteHandler}></DeleteModal>
    </div>
  );
};

