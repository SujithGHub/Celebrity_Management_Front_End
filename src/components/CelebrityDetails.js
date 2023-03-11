import React, { useEffect, useState } from "react";
// import '../css/Admin.css'
import AddIcon from '@mui/icons-material/Add';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import BorderColorIcon from '@mui/icons-material/BorderColor';
import SearchIcon from '@mui/icons-material/Search';
import { Button, IconButton, InputAdornment, TextField, Tooltip } from "@mui/material";
import CardMedia from "@mui/material/CardMedia";
import _ from "lodash";
import moment from "moment";
import { useNavigate } from "react-router-dom";
import Logo from '../assets/Google-Calendar-icon.png';
import EditIcon from '../assets/edit_icon.png';
import axiosInstance from "../util/Interceptor";
import Loader from "../util/Loader";
import StatusDropDown from '../util/StatusDropDown';

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
  const [loading, setLoading] = useState(false);

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
    setLoading(true)
    axiosInstance.get(`/celebrity/get-all-celebrity`).then(res => {
      let result = _.orderBy(res, 'name')
      let activeFilter = _.filter(result, (res => res.status === "ACTIVE"))
      setActiveCelebrity(activeFilter)
      let inactiveFilter = _.filter(result, (res => res.status === "INACTIVE"))
      setInactiveCelebrity(inactiveFilter)
      // setCelebrity(result);
      setFilter(result);
      setLoading(false);
    })
  }

  const filterHandler = (e, active) => {
    const filterResults = filter.filter(item => item.name?.toLowerCase().includes(e.target.value.toLowerCase()))
    console.log(filterResults, "filterResults")
    if (active === true) {
      setActiveCelebrity(filterResults)
    } else if (active === false) {
      setInactiveCelebrity(filterResults)
    }
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
      setAnchorEl(null);
    }
    else if (value === 'INACTIVE') {
      setActive(false);
      setAnchorEl(null);
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
    <>
      <header className="header">
        <div style={{ display: "flex", justifyContent: "center" }}>
          <Button onClick={() => navigate("/processing")} color='error' title="Back"><ArrowBackIcon /></Button>
          <h3 style={{ marginBottom: 0 }}>Celebrity Details</h3>
        </div>
        <div>
          <TextField
            id="filled-search"
            className="text"
            onChange={(e) => filterHandler(e, active)}
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
      {loading ? <Loader /> :
        <div className="celebrity-card">
          {getActive().map(celebrityItem => (
            <div class="flip-card">
              <div class="flip-card-inner">
                <div class="flip-card-front">
                  <CardMedia
                    component="img"
                    src={`data:image/jpeg/png;base64,${celebrityItem?.base64Image}`}
                    style={{ borderRadius: '2rem 0 2rem 0', width: '270px', height: '397px' }}
                    alt={celebrityItem?.name}
                  />
                </div>
                <div class="flip-card-back">
                  <div style={{ padding: '20px 0 0 20px', wordBreak: 'break-all', cursor: 'default', minHeight: '300px', color: 'white', opacity: 1 }}>
                    <h6 className="celebrity-info"><span>DOB</span>: {moment(celebrityItem?.dateOfBirth).format('DD/MM/YYYY')}</h6>
                    <h6 className="celebrity-info"><span>Gender</span>: {celebrityItem?.gender?.toUpperCase()}</h6>
                    <div className="scroll" style={{ maxHeight: '2rem', wordWrap: 'break-word', overflow: 'auto' }}>
                      <h6 className="celebrity-info"><span>Email</span>: {celebrityItem?.mailId}</h6>
                    </div>
                    <h6 className="celebrity-info"><span>Mobile</span>: {celebrityItem?.phoneNumber}</h6>
                    <div className="scroll" style={{ maxHeight: '4rem', height: '4rem', wordWrap: 'break-word', overflow: 'auto' }}>
                      <h6 className="celebrity-info"><span>Address</span>: {celebrityItem?.address}</h6>
                    </div>
                    <h6 style={{ textAlign: 'left', textDecoration: 'underline' }}>Description:</h6>
                    <div className="scroll" style={{ maxHeight: '7.5rem', height: '7.5rem', wordWrap: 'break-word', overflow: 'auto' }}>
                      <p style={{ color: 'white', paddingRight: '10px', paddingBottom: '10px', textAlign: 'left', textIndent: '1rem', wordBreak: 'break-word' }}>{celebrityItem?.description}</p>
                    </div>
                  </div>
                  <div className='celebrity-container'>
                    {/* <Tooltip title='View Event Details'>
                      <Button className='primary' variant='contained' onClick={() => navigate('/event-details', { state: { c: celebrityItem } })} style={{ borderRadius: '3rem', backgroundColor: 'yellow', color: 'red', width: '121px', height: '30px', fontSize: '10px', fontWeight: '700' }}>View Calendar</Button>
                    </Tooltip> */}
                    {/* <Tooltip title='Edit'>
                      <IconButton style={{ color: 'red' }} onClick={() => navigate('/add-celebrity-details', { state: { CelebrityDetails: celebrityItem } })}>
                        <img src={EditIcon} style={{ marginRight: 0 }} alt="image" width='35px' height='35px' />
                      </IconButton>
                    </Tooltip> */}
                  </div>
                </div>
              </div>
              <div className="card-footer">
                <Tooltip title='Edit'>
                  <IconButton style={{ color: 'red' }} onClick={() => navigate('/add-celebrity-details', { state: { CelebrityDetails: celebrityItem } })}>
                    <img src={EditIcon} style={{ marginRight: 0 }} alt="image" width='30px' height='30px' />
                  </IconButton>
                </Tooltip>
                <Button variant="text" onClick={() => navigate('/event-details', { state: { c: celebrityItem } })} startIcon={<img src={Logo} style={{ marginRight: 0 }} alt="image" width='30px' height='30px' />}>
                </Button>
                <div className="divider"></div>
                <h2 style={{ marginLeft: '1rem', marginBottom: '0', fontFamily: '"TrasandinaW03Light",sans-serif', fontSize: '1.3rem' }}>{celebrityItem?.name}</h2>
              </div>
            </div>))}
        </div>}
    </>
  );
};

