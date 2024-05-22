import ChevronLeftIcon from '@mui/icons-material/ChevronLeft';
import ChevronRightIcon from '@mui/icons-material/ChevronRight';
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';
import KeyboardArrowRightIcon from '@mui/icons-material/KeyboardArrowRight';
import MenuIcon from '@mui/icons-material/Menu';
import { Backdrop, Collapse, IconButton, List, ListItem, ListItemButton, ListItemText } from '@mui/material';
import MuiAppBar from '@mui/material/AppBar';
import Box from '@mui/material/Box';
import CssBaseline from '@mui/material/CssBaseline';
import Divider from '@mui/material/Divider';
import Drawer from '@mui/material/Drawer';
import Toolbar from '@mui/material/Toolbar';
import { styled, useTheme } from '@mui/material/styles';
import _ from 'lodash';
import * as React from 'react';
import { Link, Outlet, useLocation } from 'react-router-dom';
import Header from './Header';
import { Routes } from './RoutesJson';
const drawerWidth = 240;

const Main = styled('main', { shouldForwardProp: (prop) => prop !== 'open' })(
  ({ theme, open }) => ({
    flexGrow: 1,
    padding: theme.spacing(3),
    transition: theme.transitions.create('margin', {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.leavingScreen,
    }),
    marginLeft: `-${drawerWidth}px`,
    ...(open && {
      transition: theme.transitions.create('margin', {
        easing: theme.transitions.easing.easeOut,
        duration: theme.transitions.duration.enteringScreen,
      }),
      marginLeft: 0,
    }),
  }),
);

const AppBar = styled(MuiAppBar, {
  shouldForwardProp: (prop) => prop !== 'open',
})(({ theme, open }) => ({
  transition: theme.transitions.create(['margin', 'width'], {
    easing: theme.transitions.easing.sharp,
    duration: theme.transitions.duration.leavingScreen,
  }),
  ...(open && {
    width: `calc(100% - ${drawerWidth}px)`,
    marginLeft: `${drawerWidth}px`,
    transition: theme.transitions.create(['margin', 'width'], {
      easing: theme.transitions.easing.easeOut,
      duration: theme.transitions.duration.enteringScreen,
    }),
  }),
}));

const DrawerHeader = styled('div')(({ theme }) => ({
  display: 'flex',
  alignItems: 'center',
  padding: theme.spacing(0, 1),
  // necessary for content to be below app bar
  ...theme.mixins.toolbar,
  justifyContent: 'flex-end',
}));

export default function Layout() {
  const [token, setToken] = React.useState('');
  const [user, setUser] = React.useState('')
  const theme = useTheme();
  const location = useLocation();
  const [open, setOpen] = React.useState(false);
  const [openSubmenu, setOpenSubmenu] = React.useState({});

  React.useEffect(() => {
    setUser(JSON.parse(localStorage.getItem('user')))
    getToken();
  }, [])

  const getToken = () => {
    const tok = localStorage.getItem('token');
    setToken(tok);
  }


  const handleDrawerOpen = () => {
    setOpen(true);
  };

  const handleDrawerClose = () => {
    setOpen(false);
    setOpenSubmenu({});
  };
  const handleSubmenuClick = (key) => {
    setOpenSubmenu((prevState) => ({
      ...prevState,
      [key]: !prevState[key]
    }));
  };
  return (
    <Box sx={{ display: 'flex' }}>
      <CssBaseline />
      <AppBar open={open} style={{ backgroundColor: 'white' }}>
        <Toolbar>
          <IconButton
            color="black"
            aria-label="open drawer"
            onClick={handleDrawerOpen}
            edge="start"
            sx={{ mr: 2, ...(open && { display: 'none' }) }}
          >
            <MenuIcon />
          </IconButton >

          <Header />
        </Toolbar>
      </AppBar>
      <Drawer
        sx={{
          width: drawerWidth,
          flexShrink: 0,
          '& .MuiDrawer-paper': {
            width: drawerWidth,
            boxSizing: 'border-box',
            // backgroundColor:'rgb(245, 130, 31)'
          },
        }}
        variant="persistent"
        anchor="left"
        open={open}
      >
        <DrawerHeader>
          <IconButton onClick={handleDrawerClose}>
            {theme.direction === 'ltr' ? <ChevronLeftIcon /> : <ChevronRightIcon />}
          </IconButton>
        </DrawerHeader>
        <Divider />
        <List sx={{ paddingTop: '0px' }}>
          {_.map(Routes, (route, key) => (
            <React.Fragment key={key}>
              {route.submenu ? (
                <>
                  <ListItem disablePadding>
                    <ListItemButton onClick={() => handleSubmenuClick(key)}>
                      {route.icon}
                      <ListItemText primary={key.replace(/-/g, ' ')} />
                      {openSubmenu[key] ? <KeyboardArrowDownIcon /> : <  KeyboardArrowRightIcon />}
                    </ListItemButton>
                  </ListItem>
                  <Collapse in={openSubmenu[key]} timeout="auto" unmountOnExit >
                    <List component="div" disablePadding>
                      {_.map(route.submenu, (subRoute, subKey) => (
                        <ListItem key={subRoute.URL} disablePadding>
                          <ListItemButton
                            component={Link}
                            to={subRoute.URL}
                            sx={{
                              pl: 4,
                              backgroundColor: location.pathname === subRoute.URL ? 'rgb(245, 130, 31)' : '',
                              color: location.pathname === subRoute.URL ? 'white' : 'black'
                            }}
                          >
                            {subRoute.icon}
                            <ListItemText primary={subKey.replace(/-/g, ' ')} />
                          </ListItemButton>
                        </ListItem>
                      ))}
                    </List>
                  </Collapse>
                </>
              ) : (
                <ListItem key={route.URL} disablePadding>
                  <ListItemButton
                    component={Link}
                    to={route.URL}
                    sx={{
                      backgroundColor: location.pathname === route.URL ? 'rgb(245, 130, 31)' : '',
                      color: location.pathname === route.URL ? 'white' : 'black',
                    }}
                  >
                    {route.icon}
                    <ListItemText primary={key.replace(/-/g, ' ')} />
                  </ListItemButton>
                </ListItem>
              )}
            </React.Fragment>
          ))}
        </List>
        <Divider />
      </Drawer>
      {open && (
        <Backdrop
          sx={{ zIndex: theme.zIndex.drawer - 1 }}
          open={open}
          onClick={handleDrawerClose}
        />
      )}
      <Main open={open}>
        <DrawerHeader />
        <Outlet />
      </Main>
    </Box>
  );
}
