import * as React from 'react';
import AppBar from '@mui/material/AppBar';
import Box from '@mui/material/Box';
import Toolbar from '@mui/material/Toolbar';
import IconButton from '@mui/material/IconButton';
import Typography from '@mui/material/Typography';
import Menu from '@mui/material/Menu';
import MenuIcon from '@mui/icons-material/Menu';
import Container from '@mui/material/Container';
import Avatar from '@mui/material/Avatar';
import Button from '@mui/material/Button';
import Tooltip from '@mui/material/Tooltip';
import MenuItem from '@mui/material/MenuItem';
import AdbIcon from '@mui/icons-material/Adb';
import { useLocation, useNavigate } from 'react-router-dom';
import _ from 'lodash';
import Logo from '../assets/logo.png';
import { logout } from './Api';

const pages = { 'Enquiry': '/enquiry-details', 'Schedule': '/processing', 'Celebrity': '/celebrity-details' };
const settings = {'Logout' : logout};

function Header() {

  const navigate = useNavigate();
  const location = useLocation();
  const path = location.pathname;

  const [anchorElNav, setAnchorElNav] = React.useState(null);
  const [anchorElUser, setAnchorElUser] = React.useState(null);

  React.useEffect(() => {
    console.log(path, 'path')
  }, [location])

  const handleOpenNavMenu = (event) => {
    setAnchorElNav(event.currentTarget);
  };
  const handleOpenUserMenu = (event) => {
    setAnchorElUser(event.currentTarget);
  };

  const handleCloseNavMenu = () => {
    setAnchorElNav(null);
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

  return (
    <>
    {(path === '/' || path === '/client') ? null : <AppBar position="static">
      <Container maxWidth="xl">
        <Toolbar disableGutters>
          <Typography
            variant="h6"
            noWrap
            component="a"
            href="www.innovservicesonline.com"
            sx={{
              mr: 2,
              display: { xs: 'none', md: 'flex' },
              fontFamily: 'monospace',
              fontWeight: 700,
              letterSpacing: '.3rem',
              color: 'inherit',
              textDecoration: 'none',
            }}
          >
            <img style={{ cursor: 'pointer' }} alt='Logo' src={Logo} width='80' height='50'></img>
          </Typography>
            <Typography variant='h5' style={{fontWeight: 'bold',}}>{getName(pages, path)}</Typography>
          <Box sx={{ flexGrow: 1, display: { xs: 'none', md: 'flex', justifyContent: 'flex-end' } }}>
              {path === '/enquiry-details' ? '' : <Button sx={{ my: 2, mx: 2,color: 'white', display: 'block' }} className='button-test' onClick={() => navigate('/enquiry-details')}>Enquiry</Button>}
              {path === '/processing' ? '' : <Button sx={{ my: 2, mx: 2,color: 'white', display: 'block' }} onClick={() => navigate('/processing')}>Schedule</Button>}
              {path === '/celebrity-details' ? '' : <Button sx={{ my: 2, mx: 2,color: 'white', display: 'block' }} onClick={() => navigate('/celebrity-details')} >Celebrity</Button>}
          </Box>
          <Box sx={{ flexGrow: 0 }}>
            <Tooltip title="Open settings">
              <IconButton onClick={handleOpenUserMenu} sx={{ p: 0 }}>
                <Avatar />
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
        </Toolbar>
      </Container>
    </AppBar>}
    </>
  );
}
export default Header;