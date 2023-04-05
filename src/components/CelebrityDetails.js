import AddIcon from '@mui/icons-material/Add';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import SearchIcon from '@mui/icons-material/Search';
import { Button, InputAdornment, TextField, Tooltip } from "@mui/material";
import Box from '@mui/material/Box';
import CardMedia from "@mui/material/CardMedia";
import Grid from '@mui/material/Grid';
import _ from "lodash";
import moment from 'moment';
import { useEffect, useState } from 'react';
import { useNavigate } from "react-router-dom";
import Logo from '../assets/Google-Calendar-icon.png';
import axiosInstance from "../util/Interceptor";
import StatusDropDown from '../util/StatusDropDown';
const CelebrityDetails = () => {
  const navigate = useNavigate()
  const [filter, setFilter] = useState([]);
  const [search, setSearch] = useState([]);
  const [anchorEl, setAnchorEl] = useState(null);
  const [activeCelebrity, setActiveCelebrity] = useState([]);
  const [inactiveCelebrity, setInactiveCelebrity] = useState([]);
  const [active, setActive] = useState(true);
  const [, setLoading] = useState(false);
  const [token, setToken] = useState('');

  const openMenu = Boolean(anchorEl);

  const dropDownItem = ['ACTIVE', 'INACTIVE']

  useEffect(() => {
    getAllCelebrity();
    getToken();
  }, []);

  const getAllCelebrity = () => {
    setLoading(true)
    axiosInstance.get(`/celebrity/get-all-celebrity`).then(res => {
      let result = _.orderBy(res, 'name')
      let activeFilter = _.filter(result, (res => res.status === "ACTIVE"))
      setActiveCelebrity(activeFilter)
      let inactiveFilter = _.filter(result, (res => res.status === "INACTIVE"))
      setInactiveCelebrity(inactiveFilter)
      setFilter(result);
      setLoading(false);
    })
  }

  const filterHandler = (e, active) => {
    const filterResults = filter.filter(item => item.name?.toLowerCase().includes(e.target.value.toLowerCase()))
    if (active === true) {
      setActiveCelebrity(filterResults)
    } else if (active === false) {
      setInactiveCelebrity(filterResults)
    }
    setSearch(e.target.value)
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

  const getActive = () => {
    return active ? activeCelebrity : inactiveCelebrity
  }
  const getToken = () => {
    let tok = localStorage.getItem("token");
    setToken(tok);
  }

  return (
    <>
      <div style={{ paddingTop: '70px' }}>
        <header className={token ? 'private-header' : 'header'}>
          {token ? <div style={{ display: "flex", width: '15rem', paddingLeft: '1.5rem' }}>
            <Button onClick={() => navigate("/processing")} color='error' title="Back"><ArrowBackIcon /></Button>
          </div> : ""}
          <div >
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
          {token === null ? "" : <div style={{ width: "15rem", display: "flex", justifyContent: "space-around" }}>
            <Button className="primary" style={{ backgroundColor: '#f5821f' }} variant="contained" title="Add celebrity" onClick={() => navigate('/add-celebrity-details')}><AddIcon /></Button>
            <StatusDropDown dropDownItem={dropDownItem} buttonName="Status" anchorEl={anchorEl} handleClick={handleClick} handleMenuClose={handleMenuClose} openMenu={openMenu} ></StatusDropDown>
          </div>}
        </header>
        <Box sx={{ flexGrow: 1 }}>
          <Grid container spacing={{ xs: 2, md: 3 }} columns={{ xs: 4, sm: 8, md: 12 }}>
            {getActive().map((celebrityItem, key) => (
              <Grid item xs={4} sm={4} md={3} key={key}>
                <div className="celebrity-card">
                  <div className="flip-card" key={celebrityItem?.id}>
                    <div className="flip-card-inner">
                      <div className="flip-card-front">
                        <CardMedia
                          component="img"
                          src={`data:image/jpeg/png;base64,${celebrityItem?.base64Image}`}
                          style={{ borderRadius: '2rem 0 2rem 0', width: '270px', height: '397px' }}
                          alt={celebrityItem?.name}
                        />
                      </div>
                      <div className="flip-card-back">
                        <div className="celebrity-info-container">
                          <h6><span>DOB</span>: {moment(celebrityItem?.dateOfBirth).format('DD/MM/YYYY')}</h6>
                          <h6><span>Gender</span>: {celebrityItem?.gender?.toUpperCase()}</h6>
                          <div className="scroll">
                            <h6><span>Email</span>: {celebrityItem?.mailId}</h6>
                          </div>
                          <h6><span>Mobile</span>: {celebrityItem?.phoneNumber}</h6>
                          <div className="scroll card-address">
                            <h6><span>Address</span>: {celebrityItem?.address}</h6>
                          </div>
                          <h5 className="description-header">Description:</h5>
                          <div className="scroll description-content">
                            <p>{celebrityItem?.description}</p>
                          </div>
                        </div>
                      </div>
                    </div>
                    <div className="card-footer">
                      <div style={{ width: '120px', display: 'flex', justifyContent: 'space-evenly' }}>
                        {token ?
                          <>
                            <div className="celebrity-profile">
                              <button variant="outlined" onClick={() => navigate('/celebrity-profile', { state: { celebrity: celebrityItem } })}>{celebrityItem?.name}</button>
                            </div>
                            <div className="divider"></div>
                            <Tooltip title='View Calendar'>
                              <Button variant="text" onClick={() => navigate('/event-details', { state: { c: celebrityItem } })} startIcon={<img src={Logo} style={{ marginRight: 0 }} alt="logo" width='30px' height='30px' />}>
                              </Button>
                            </Tooltip>
                          </>
                          :
                          <Button className="Primary" variant="contained" onClick={() => navigate('/client', { state: { celebrity: celebrityItem } })} style={{ marginRight: '1.5rem' }}>BookNow</Button>
                        }
                      </div>
                    </div>
                  </div>
                </div>
              </Grid>
            ))}
          </Grid>
        </Box>
      </div>
    </>
  );
};

export default CelebrityDetails;