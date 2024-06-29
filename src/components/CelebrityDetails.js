import SearchIcon from '@mui/icons-material/Search';
import { Button, InputAdornment, TextField, Tooltip } from "@mui/material";
import Box from '@mui/material/Box';
import CardMedia from "@mui/material/CardMedia";
import Grid from '@mui/material/Grid';
import _ from 'lodash';
import { useEffect, useState } from 'react';
import { useNavigate } from "react-router-dom";
import Logo from '../assets/Google-Calendar-icon.png';
import '../css/Admin.css';
import axiosInstance from "../util/Interceptor";
import { CIRCLE_WITH_BAR } from '../util/Loader';
import StatusDropDown from '../util/StatusDropDown';
import { getImagePath } from '../util/Validation';

const CelebrityDetails = () => {
  const navigate = useNavigate()
  const [, setFilter] = useState([]);
  const [search, setSearch] = useState([]);
  const [anchorEl, setAnchorEl] = useState(null);
  const [, setCelebrity] = useState([]);
  const [activeCelebrity, setActiveCelebrity] = useState([]);
  const [inactiveCelebrity, setInactiveCelebrity] = useState([]);
  const [active, setActive] = useState(true);
  const [loading, setLoading] = useState(false);
  const [token, setToken] = useState('');

  const openMenu = Boolean(anchorEl);

  const dropDownItem = ['ACTIVE', 'INACTIVE']

  useEffect(() => {
    getAllCelebrity();
    getToken();
  }, []);

  const getAllCelebrity = () => {
    setLoading(true)
    setSearch("")
    axiosInstance.get(`/celebrity/get-all-celebrity`).then(res => {
      let result = _.orderBy(res, 'name')
      setCelebrity(result);
      let activeFilter = _.filter(result, (res => res.status === "ACTIVE"))
      setActiveCelebrity(activeFilter)
      let inactiveFilter = _.filter(result, (res => res.status === "INACTIVE"))
      setInactiveCelebrity(inactiveFilter)
      setFilter(activeFilter);
      setLoading(false);
    }).catch(() => {
      setLoading(false);
    })
  }

  const getByCategory = (e) => {
    setSearch(e.target.value);
    setLoading(true);
    axiosInstance.get(`/celebrity/search?value=${e.target.value}`).then((res) => {
        setCelebrity(res);
        let activeFilter = _.filter(res, (res) => res.status === "ACTIVE");
        setActiveCelebrity(activeFilter);
        let inactiveFilter = _.filter(res, (res) => res.status === "INACTIVE");
        setInactiveCelebrity(inactiveFilter);
        setFilter(activeFilter);
        setLoading(false);
      })
      .catch((error) => {
        console.error("Error fetching data:", error);
        setLoading(false);
      });
  };

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
      <div>
        <header className={'private-header'}>
            <TextField
              id="filled-search"
              className="text"
              onChange={getByCategory}
              value={search}
              type="search"
              variant="outlined"
              placeholder="Search Celebrity..."
              size="small"
              InputProps={{
                style: {
                  borderRadius: '1rem'
                },
                startAdornment: (
                  <InputAdornment position="start">
                      <SearchIcon />
                  </InputAdornment>
                ),
              }}
            />
            <div style={{ width: "15rem", display: "flex", justifyContent: "space-around" }}>
            <StatusDropDown dropDownItem={dropDownItem} buttonName="Status" anchorEl={anchorEl} handleClick={handleClick} handleMenuClose={handleMenuClose} openMenu={openMenu} ></StatusDropDown>
          </div>
        </header>
    {loading ? CIRCLE_WITH_BAR :
        <Box sx={{ flexGrow: 1 }}>
          <Grid container spacing={{ xs: 2 }}>
            {getActive()?.map((celebrityItem, index) => (
              <Grid item xs={12} xl={3} sm={6} md={4} lg={3} key={index}>
                <div className="celebrity-card">
                  <div className="flip-card" key={celebrityItem.id}>
                    <div className="flip-card-inner">
                      <div className="flip-card-front">
                        <CardMedia
                          component="img"
                          src={getImagePath(celebrityItem.image)}
                          style={{ borderRadius: '2rem 0 2rem 0', width: '270px', height: '397px' }}
                          alt={celebrityItem.name}
                        />
                      </div>
                      <div className="flip-card-back">
                        <div className="celebrity-info-container">
                          <h6><span>Location</span>: {celebrityItem.location}</h6>
                          <h6><span>Status</span>: {celebrityItem.status}</h6>
                          <>
                            <div className="scroll">
                              <h6><span>Email</span>: {celebrityItem.mailId}</h6>
                            </div>
                            <h6><span>Mobile</span>: {celebrityItem.phoneNumber}</h6>
                            <div className="scroll card-address">
                              <h6><span>Charges</span>: {celebrityItem.charges}</h6>
                            </div></>
                          <h5 className="description-header">Category:</h5>
                          <div>
                            <p key={index}>{celebrityItem.categories.map(cat => cat.name).join(', ')}</p>
                          </div>
                          <h5 className="description-header">Topics:</h5>
                          <div className={'scroll description-content1'}>
                            <p>{celebrityItem.topics.map(topic => topic.name).join(', ')}</p>
                          </div>
                        </div>
                      </div>
                    </div>
                    <div className="card-footer">
                      <div style={{ display: 'flex', justifyContent: 'space-evenly' }}>
                        {token ?
                          <>
                            <div className="celebrity-profile">
                              <button variant="outlined" onClick={() => navigate(`/celebrity-profile/${celebrityItem.id}`)}>{celebrityItem?.name}</button>
                            </div>
                            <div className="divider"></div>
                            <Tooltip title='View Calendar'>
                              <Button variant="text" onClick={() => navigate('/event-details', { state: { c: celebrityItem } })} startIcon={<img src={Logo} style={{ marginRight: 0, marginLeft: '20px' }} alt="logo" width='30px' height='30px' />}>
                              </Button>
                            </Tooltip>
                          </>
                          :
                          <>
                            <p style={{ display: 'flex', alignItems: 'center', textAlign: 'end', margin: '0', marginRight: '1rem' }}>{celebrityItem?.name}</p>
                            <div className='divider'></div>
                            <div className="celebrity-profile">
                              <button variant="outlined" onClick={() => navigate('/client')}>BOOK NOW</button>
                            </div>
                          </>
                        }
                      </div>
                    </div>
                  </div>
                </div>
              </Grid>
            ))}
          </Grid>
        </Box>}
      </div>
    </>
  );
};

export default CelebrityDetails;