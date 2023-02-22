import axios from "axios";
import React, { useEffect, useState } from "react";
// import '../css/Admin.css'
import BorderColorIcon from '@mui/icons-material/BorderColor';
import DeleteIcon from '@mui/icons-material/Delete';
import EventAvailableIcon from '@mui/icons-material/EventAvailable';
import { Button, CardActionArea, IconButton, InputAdornment, TextField, Tooltip } from "@mui/material";
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import CardMedia from "@mui/material/CardMedia";
import Typography from "@mui/material/Typography";
import _ from "lodash";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { authHeader, errorHandler } from "../util/Api";
import { REST_API } from "../util/EndPoints";
import SearchIcon from '@mui/icons-material/Search';

export const CelebrityDetails = () => {
  const navigate = useNavigate()
  const [celebrity, setCelebrity] = useState([]);
  const [filter, setFilter] = useState([]);
  const [search, setSearch] = useState([]);
  const [count, setCount] = useState(0);
  const [invisible, setInvisible] = useState(false);

  useEffect(() => {
    getAllCelebrity();
  }, []);

  const getAllCelebrity = () => {
    axios.get(`${REST_API}/celebrity/get-all-celebrity`, { headers: authHeader() }).then(res => {
      setCelebrity(_.orderBy(res.data, 'name'));
      setFilter((_.orderBy(res.data, 'name')));
    }).catch(error => {
      errorHandler(error);
    })
  }

  const filterHandler = (e) => {
    const filterResults = filter.filter(item => item.name.toLowerCase().includes(e.target.value.toLowerCase()))
    setCelebrity(filterResults)
    setSearch(e.target.value)
  }

  const deleteHandler = (id) => {
    axios.delete(`${REST_API}/celebrity/${id}`, { headers: authHeader() }).then((res) => {
      getAllCelebrity();
    }).catch(error => {
      toast.error(error.message);
    })
  }

  const handleLogOut = () => {
    localStorage.clear("token");
    window.location.href = "/";
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
          <Button className="primary" style={{ marginLeft: '2rem' }} onClick={() => handleLogOut()} variant="outlined" color="error">Log Out</Button>
        </div>
      </header>
        <div className="container" style={{ display: "flex", flexWrap: "wrap", maxWidth: "78rem" }} >
          {celebrity.map((celebrityItem, index) => (
            <Card sx={{ maxWidth: 345, width: 345, height: '515px', margin: "30px", overflowWrap: 'break-word' }} key={celebrityItem?.id} >
              <CardActionArea style={{minHeight: '28rem'}} >
                <CardMedia
                  component="img"
                  height="140"
                  image="https://images.unsplash.com/photo-1550751464-57982110c246?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1887&q=80"
                  alt="green iguana"
                />
                <CardContent style={{ height: '20rem', padding: '10px', overflow: 'auto',maxHight: '150px' }}>
                  <Typography gutterBottom variant="h5" component="div" style={{ textAlign: 'center' }} >
                    {celebrityItem.name}
                  </Typography>
                  <Typography variant="body2" color="text.secondary" style={{ textIndent: '1rem' }}>
                    {celebrityItem.description}
                  </Typography>
                <div style={{ padding: '10px 10px', wordBreak:'break-all' }}>
                  <h6><span className="celebrity-info">DOB</span>: {celebrityItem?.dateOfBirth}</h6>
                  <h6><span className="celebrity-info">Gender</span>: {celebrityItem?.gender.toUpperCase()}</h6>
                  <h6><span className="celebrity-info">Email</span>: {celebrityItem?.mailId}</h6>
                  <h6><span className="celebrity-info">Mobile</span>: {celebrityItem?.phoneNumber}</h6>
                  <h6><span className="celebrity-info">Address</span>: {celebrityItem?.address}</h6>
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
    </div>
  );
};

