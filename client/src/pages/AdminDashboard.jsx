import { useState, useEffect, useContext } from 'react';
import axios from 'axios';
import { Grid, Typography, Table, TableContainer, TableHead, TableRow, TableCell } from '@mui/material';
import NotFound from './NotFound';
import TokenContext from '../context/TokenProvider';
import { ComposedChart, Area, Bar, CartesianGrid, Tooltip, XAxis, YAxis, Legend } from 'recharts';
import { TableBody } from '@mui/material';

const EarningsChart = ({ data }) => (
  <ComposedChart width={800} height={400} data={data} margin={{ top: 10, right: 10, left: 10, bottom: 10 }}>
    <defs>
      <linearGradient id='colorArea' x1='0' y1='0' x2='0' y2='1'>
        <stop offset='5%' stopColor='#82ca9d' stopOpacity={0.8} />
        <stop offset='95%' stopColor='#82ca9d' stopOpacity={0} />
      </linearGradient>
    </defs>
    <XAxis dataKey='_id' />
    <YAxis />
    <CartesianGrid strokeDasharray='3 3' />
    <Tooltip />
    <Legend />
    <Area
      name='Total sales (RM)'
      type='monotone'
      dataKey='totalSaleAmount'
      stroke='#82ca9d'
      fillOpacity={1}
      fill='url(#colorArea)'
    />
    <Bar name='Order count' dataKey='count' barSize={20} fill='#413ea0' />
  </ComposedChart>
);

const LowStockTable = ({ data }) => (
  <TableContainer>
    <Typography variant='h5'>Low Stock Items</Typography>
    <Table>
      <TableHead>
        <TableRow>
          <TableCell>Product Name</TableCell>
          <TableCell>Quantity</TableCell>
        </TableRow>
      </TableHead>
      <TableBody>
        {data.map((item) => (
          <TableRow key={item.id}>
            <TableCell>{item.name}</TableCell>
            <TableCell>{item.quantity}</TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  </TableContainer>
);

export default function AdminDashboard() {
  const [earningsData, setEarningsData] = useState({});
  const [countData, setCountData] = useState([]);
  const { user } = useContext(TokenContext);

  useEffect(() => {
    axios
      .get(`http://localhost:6969/api/v1/orders/sales`)
      .then((res) => setEarningsData(res.data))
      .catch((err) => console.log(err));
    axios
      .get(`http://localhost:6969/api/v1/products/count`)
      .then((res) => setCountData(res.data))
      .catch((err) => console.log(err));
  }, []);

  return user.isAdmin ? (
    <div>
      <Typography variant='h4' py={3} textAlign='center'>
        Welcome, {user.name}!
      </Typography>
      <Grid
        container
        justifyContent='center'
        alignItems='flex-start'
        spacing={3}
        width={'100%'}
        style={{ margin: '0 auto' }}
      >
        <Grid item sm={12} md={4}>
          <LowStockTable data={countData} />
        </Grid>
        <Grid item sm={12} md={8}>
          <EarningsChart data={earningsData} />
        </Grid>
      </Grid>
    </div>
  ) : (
    <NotFound />
  );
}
