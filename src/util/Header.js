import { Avatar, Box, IconButton, Menu, MenuItem, Tooltip, Typography } from '@mui/material';
import * as React from 'react';
import { useLocation } from 'react-router-dom';
import Logo from '../assets/logo1.png';
import { logout } from './Api';

const pages = { 'Enquiry': '/enquiry-details', 'Schedule': '/processing', 'Celebrity': '/celebrity-details' };
const settings = { 'Logout': logout };

function Header() {

  const location = useLocation();

  const path = location.pathname;

  const [anchorElUser, setAnchorElUser] = React.useState(null);
  const [,setToken] = React.useState('')
  const [user, setUser] = React.useState('')

  React.useEffect(() => {
    setUser(JSON.parse(localStorage.getItem('user')))
    getToken();
  }, [])

  const handleOpenUserMenu = (event) => {
    setAnchorElUser(event.currentTarget);
  };

  const handleCloseUserMenu = () => {
    setAnchorElUser(null);
  };

  const getName = (pages, path) => {
    for (const [key, value] of Object.entries(pages)) {
      if (value === path) {
        return key + " Details";
      }
    }
    return null;
  }
  const getToken = () => {
    const tok = localStorage.getItem('token');
    setToken(tok);
  }

  return (
    <div style={{ display: 'flex', justifyContent: 'space-between',width:'100%' }}>

      {/* <Toolbar disableGutters> */}
      <Typography
        variant="h6"
        noWrap
        component="a"
        href="https://innovservices.com/"
        sx={{
          mr: 2,
          display: { xs: 'none', md: 'flex' },
          fontFamily: 'montserrat',
          fontWeight: 700,
          letterSpacing: '.3rem',
          color: 'inherit',
          textDecoration: 'none',
        }}
      >
        <img style={{ cursor: 'pointer' }} alt='Logo' src={Logo} width='80' height='50'></img>
      </Typography>
      <Typography variant='h5' style={{ fontWeight: 'bold', color: 'black',display:'flex',alignItems:'center', fontFamily: 'montserrat' }}>{getName(pages, path)}</Typography>
      <Box sx={{ flexGrow: 0 }} style={{ display: 'flex', width: '8rem', justifyContent: 'flex-end'}}>
        <Tooltip title="Logout">
          <IconButton onClick={handleOpenUserMenu} sx={{ p: 0}}>
            <Avatar style={{ background: 'grey' }}>{user?.name?.charAt(0)}</Avatar>
          </IconButton>
        </Tooltip>
        <Menu
          id="menu-appbar"
          anchorEl={anchorElUser}
          anchorOrigin={{
            vertical: 'bottom',
            horizontal: 'right',
          }}
          keepMounted
          transformOrigin={{
            vertical: 'top',
            horizontal: 'right',
          }}
          open={Boolean(anchorElUser)}
          onClose={handleCloseUserMenu}
        >
          {Object.entries(settings).map(([key, value]) => (
            <MenuItem key={key} onClick={handleCloseUserMenu}>
              <Typography textAlign="center" onClick={() => value()}>{key}</Typography>
            </MenuItem>
          ))}
        </Menu>
      </Box>
    </div>
    
  );
}
export default Header;