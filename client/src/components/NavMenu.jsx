import React, { useState, useContext } from 'react';
import { Link } from 'react-router-dom';
import {
  AppBar,
  Avatar,
  Box,
  Drawer,
  IconButton,
  Toolbar,
  Typography,
  List,
  ListItem,
  ListItemAvatar,
  ListItemButton,
  ListItemIcon,
  ListItemText,
} from '@mui/material';
import MenuIcon from '@mui/icons-material/Menu';
import TokenContext from '../context/TokenProvider';
import GrassIcon from '@mui/icons-material/Grass';
import ForumIcon from '@mui/icons-material/Forum';
import ShoppingCartIcon from '@mui/icons-material/ShoppingCart';
import ReceiptIcon from '@mui/icons-material/Receipt';
import DashboardIcon from '@mui/icons-material/Dashboard';
import LoginIcon from '@mui/icons-material/Login';
import LogoutIcon from '@mui/icons-material/Logout';
import AppRegistrationIcon from '@mui/icons-material/AppRegistration';

export default function NavMenu() {
  const { user, setUser, token, setToken } = useContext(TokenContext);
  const [anchorElNav, setAnchorElNav] = useState(null);
  const handleOpenNavMenu = (event) => setAnchorElNav(event.currentTarget);
  const handleCloseNavMenu = () => setAnchorElNav(null);

  const logout = () => {
    sessionStorage.removeItem('token');
    setUser('');
    setToken('');
  };

  const menuItems = [
    { text: 'Products', icon: <GrassIcon />, path: '/' },
    { text: 'Forum', icon: <ForumIcon />, path: '/posts' },
    { text: 'Login', icon: <LoginIcon />, path: '/login' },
    { text: 'Register', icon: <AppRegistrationIcon />, path: '/register' },
  ];

  const userMenuItems = [
    { text: 'Products', icon: <GrassIcon />, path: '/' },
    { text: 'Cart', icon: <ShoppingCartIcon />, path: `/cart/?user=${user.userId}` },
    { text: 'Orders', icon: <ReceiptIcon />, path: `/orders/?user=${user.userId}` },
    { text: 'Forum', icon: <ForumIcon />, path: '/posts' },
    { text: 'Logout', icon: <LogoutIcon />, path: '/', onClick: () => logout() },
  ];

  const adminMenuItems = [
    { text: 'Dashboard', icon: <DashboardIcon />, path: '/admin' },
    { text: 'Products', icon: <GrassIcon />, path: '/admin/products' },
    { text: 'Orders', icon: <ReceiptIcon />, path: '/admin/orders' },
    { text: 'Forum', icon: <ForumIcon />, path: '/posts' },
    { text: 'Logout', icon: <LogoutIcon />, path: '/', onClick: () => logout() },
  ];

  let items = menuItems;
  if (token && user.isAdmin) items = adminMenuItems;
  else if (token) items = userMenuItems;

  const NavList = () => (
    <Box sx={{ width: 250 }} onClick={handleCloseNavMenu}>
      <List>
        <ListItem alignItems='flex-start'>
          <ListItemAvatar>
            <Avatar alt={user.name} />
            <ListItemText primary={user.name} />
          </ListItemAvatar>
        </ListItem>
        {items.map((item) => (
          <ListItem key={item.text} disablePadding component={Link} to={item.path}>
            <ListItemButton component='button' onClick={item.onClick}>
              <ListItemIcon>{item.icon}</ListItemIcon>
              <ListItemText primary={item.text} />
            </ListItemButton>
          </ListItem>
        ))}
      </List>
    </Box>
  );

  return (
    <Toolbar>
      <AppBar>
        <Toolbar disableGutters>
          <IconButton size='large' onClick={handleOpenNavMenu} edge='start' color='inherit' sx={{ mx: 2 }}>
            <MenuIcon />
          </IconButton>
          <Drawer open={Boolean(anchorElNav)} onClose={handleCloseNavMenu}>
            <NavList />
          </Drawer>
          <Typography variant='h6' component='div' sx={{ flexGrow: 1 }}>
            MEA Aquaponics
          </Typography>
        </Toolbar>
      </AppBar>
    </Toolbar>
  );
}
