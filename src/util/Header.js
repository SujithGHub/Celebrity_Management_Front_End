import AppBar from '@mui/material/AppBar';
import Avatar from '@mui/material/Avatar';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Container from '@mui/material/Container';
import IconButton from '@mui/material/IconButton';
import Menu from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';
import Toolbar from '@mui/material/Toolbar';
import Tooltip from '@mui/material/Tooltip';
import Typography from '@mui/material/Typography';
import * as React from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import Logo from '../assets/logo1.png';
import { logout } from './Api';

const pages = { 'Enquiry': '/enquiry-details', 'Schedule': '/processing', 'Celebrity': '/celebrity-details' };
const settings = { 'Logout': logout };

function Header() {

  const navigate = useNavigate();
  const location = useLocation();

  const path = location.pathname;

  const [anchorElUser, setAnchorElUser] = React.useState(null);
  const [token, setToken] = React.useState('')

  React.useEffect(() => {
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
    <>
      {(path === '/' || path === '/client') ? null : <AppBar position="static">
        <Container maxWidth="xl" style={{ backgroundColor: 'white', fontFamily: 'Montserrat' }}>
          <Toolbar disableGutters>
            <Typography
              variant="h6"
              noWrap
              component="a"
              href="https://innovservices.com/demo/"
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
            <Typography variant='h5' style={{ fontWeight: 'bold', color: 'black', marginLeft: '2rem' }}>{getName(pages, path)}</Typography>
            {!token ? null :
              <>
                <Box sx={{ flexGrow: 1, display: { xs: 'none', md: 'flex', justifyContent: 'flex-end', marginRight: '2rem' } }}>
                  {path === '/enquiry-details' ? '' : <Button sx={{ my: 2, mx: 2, display: 'block' }} className='button-test' color='primary' onClick={() => navigate('/enquiry-details')}>Enquiry</Button>}
                  {path === '/processing' ? '' : <Button sx={{ my: 2, mx: 2, display: 'block' }} onClick={() => navigate('/processing')} color='primary'>Schedule</Button>}
                  {path === '/celebrity-details' ? '' : <Button sx={{ my: 2, mx: 2, display: 'block' }} color='primary' onClick={() => navigate('/celebrity-details')} >Celebrity</Button>}
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
              </>
            }
          </Toolbar>
        </Container>
      </AppBar>}
    </>
  );
}
export default Header;