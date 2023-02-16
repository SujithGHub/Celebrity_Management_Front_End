import axios from "axios";
import React, { useEffect, useState } from "react";
// import '../css/Admin.css'
import BorderColorIcon from '@mui/icons-material/BorderColor';
import DeleteIcon from '@mui/icons-material/Delete';
import { Button, CardActionArea, IconButton, TextField, Tooltip } from "@mui/material";
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import CardMedia from "@mui/material/CardMedia";
import Typography from "@mui/material/Typography";
import { useNavigate } from "react-router-dom";
import { authHeader, errorHandler } from "../util/Api";
import { REST_API } from "../util/EndPoints";
import _ from "lodash";
import VisibilitySharpIcon from '@mui/icons-material/VisibilitySharp';

export const CelebrityDetails = () => {
  const navigate = useNavigate()
  const [celebrity, setCelebrity] = useState([]);
    const[filter, setFilter]=useState([]);
    const[search, setSearch]=useState([]);
  useEffect(() => {
    getAllCelebrity();
  }, []);

  const getAllCelebrity = () => {
    axios.get(`${REST_API}/celebrity/get-all-celebrity`, {headers : authHeader()}).then(res => {
      setCelebrity(_.orderBy(res.data, 'name'));
      setFilter((_.orderBy(res.data, 'name')));
    }).catch(error => {
      errorHandler(error);
    })
  }

  const filterHandler= (e)=>{

    const filterResults=filter.filter(item=>item.name.toLowerCase().includes(e.target.value.toLowerCase()))
    setCelebrity(filterResults)
    setSearch(e.target.value)
  }

  const deleteHandler = (id) => {
    axios.delete(`${REST_API}/celebrity/${id}`,{headers: authHeader()}).then((res) => {
      getAllCelebrity();
    });
  }

  const handleLogOut = () => {
    localStorage.clear("token");
    window.location.href = "/";
  }

  // const handleDay = (key) => {
  //   if (key === 'single'){
  //     setSingle(!single);
  //     setMultiple(single);
  //   }
  // }

  return (
    <div className="home">
      <header className="header">
        <h3>Celebrity Details</h3>
        <div>
        <TextField
        style={{height: '60px'}}
          id="filled-search"
          label="Search Celebrity"
          type="search"
          variant="filled"
          value={search}
          onChange={(e) => filterHandler(e)}
        />
        <Button className="primary" style={{marginLeft: '2rem'}} onClick={() => handleLogOut()} variant="outlined" color="error">Log Out</Button>
        </div>
      </header>
      <body>
      
        <div className="container" style={{ display: "flex", flexWrap: "wrap", maxWidth: "78rem" }} >

          {celebrity.map((celebrityItem, index) => (
            <Card sx={{ maxWidth: 345, width: 345,height: '480px' ,margin: "30px", overflowWrap: 'break-word' }} key={celebrityItem?.id} >
              <CardActionArea >
                <CardMedia
                  component="img"
                  height="140"
                  image="https://images.unsplash.com/photo-1550751464-57982110c246?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1887&q=80"
                  alt="green iguana"
                />
                <CardContent style={{height: '150px'}}>
                  <Typography gutterBottom variant="h5" component="div" style={{ textAlign: 'center' }} >
                    {celebrityItem.name}
                  </Typography>
                  <Typography variant="body2" color="text.secondary" style={{textIndent: '1rem'}}>
                    {celebrityItem.description}
                  </Typography>
                </CardContent>
                <div style={{ padding: '0px 1rem', height: '140px' }}>
                  <h6>Date Of Birth : {celebrityItem?.dateOfBirth}</h6>
                  <h6>Gender: {celebrityItem?.gender}</h6>
                  <h6>Email : {celebrityItem?.mailId}</h6>
                  <h6>Address: <p style={{ textIndent: '1rem' }}>{celebrityItem?.address}</p></h6>
                </div>
              </CardActionArea>
              <div className='celebrity-container'>
                <Tooltip title='view calendar'><VisibilitySharpIcon style={{cursor:'pointer' }} onClick={() => navigate('/event-details', { state: { c: celebrityItem } })} /></Tooltip>
                <IconButton aria-label="Update" title="Update" style={{ color: '#3f50b5' }} onClick={() => navigate('/add-celebrity-details', { state: { CelebrityDetails: celebrityItem } })}>
                  <BorderColorIcon />
                </IconButton>
                <IconButton aria-label="delete" title='Delete' style={{ color: 'red' }} onClick={() => deleteHandler(celebrityItem?.id)}>
                  <DeleteIcon />
                </IconButton>
              </div>
            </Card>
          ))}
          <div>
            <button style={{ width: '345px', height: '300px', background: '#FFF', margin: "30px" }} onClick={() => navigate('/add-celebrity-details')}><span style={{ fontSize: '100px' }}>+</span></button>
          </div>
        </div>
      </body>
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

