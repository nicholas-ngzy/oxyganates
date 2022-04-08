import React, { useState, useEffect } from 'react';
import axios from 'axios';
import NavMenu from '../components/NavMenu.js';
import { Card, CardContent, Grid, Typography } from '@mui/material';
import ReceiptIcon from '@mui/icons-material/Receipt';
import PeopleIcon from '@mui/icons-material/People';
import CategoryIcon from '@mui/icons-material/Category';
import NotFound from './NotFound';
import jwt_decode from 'jwt-decode';

const AdminDashboard = () => {
  // const [info, setInfo] = useState({});
  // const token = localStorage.getItem('token');
  // const config = { headers: { Authorization: `Bearer ${token}`, 'Content-Type': 'application/json' } };
  // const axiosrequest1 = axios.get('http://localhost:6969/api/v1/products/count');
  // const axiosrequest2 = axios.get('http://localhost:6969/api/v1/users/count', config);
  // const axiosrequest3 = axios.get('http://localhost:6969/api/v1/orders/count');
  // useEffect(() => {
  //   axios.all([axiosrequest1, axiosrequest2, axiosrequest3]).then(
  //     axios.spread((...responses) => {
  //       console.log(responses);
  //       setInfo(responses);
  //     })
  //   );
  // }, []);
  let decoded = '';
  if (localStorage.getItem('token')) {
    decoded = jwt_decode(localStorage.getItem('token'));
  }
  if (decoded.isAdmin) {
    return (
      <div>
        <NavMenu />
        <div className='h1 py-4'>Welcome back Admin</div>
        <Grid container spacing={2} width={'90%'} style={{ margin: '0 auto' }}>
          <Grid item md={4}>
            <Card style={{ height: '150%', backgroundColor: '#009688' }}>
              <CardContent style={{ color: '#fff' }}>
                <ReceiptIcon fontSize='large' />
                <Typography variant='h4'>2</Typography>
                <Typography variant='subtitle2'>Total orders</Typography>
              </CardContent>
            </Card>
          </Grid>
          <Grid item md={4}>
            <Card style={{ height: '150%', backgroundColor: '#673ab7' }}>
              <CardContent style={{ color: '#fff' }}>
                <CategoryIcon fontSize='large' />
                <Typography variant='h4'>7</Typography>
                <Typography variant='subtitle2'>Total products</Typography>
              </CardContent>
            </Card>
          </Grid>
          <Grid item md={4}>
            <Card style={{ height: '150%', backgroundColor: '#ff5722' }}>
              <CardContent style={{ color: '#fff' }}>
                <PeopleIcon fontSize='large' />
                <Typography variant='h4'>3</Typography>
                <Typography variant='subtitle2'>Total users</Typography>
              </CardContent>
            </Card>
          </Grid>
        </Grid>
      </div>
    );
  } else {
    return <NotFound />;
  }
};

export default AdminDashboard;
