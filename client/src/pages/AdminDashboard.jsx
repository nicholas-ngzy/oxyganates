import { useState, useEffect, useContext } from 'react';
import axios from 'axios';
import { Grid, Typography, Table, TableContainer, TableHead, TableRow, TableCell } from '@mui/material';
import NotFound from './NotFound';
import TokenContext from '../context/TokenProvider';
import { ComposedChart, BarChart, Area, Bar, CartesianGrid, Tooltip, XAxis, YAxis, Legend } from 'recharts';
import { TableBody } from '@mui/material';

const EarningsChart = ({ data }) => (
  <ComposedChart width={800} height={400} data={data}>
    <defs>
      <linearGradient id='colorArea' x1='0' y1='0' x2='0' y2='1'>
        <stop offset='5%' stopColor='#82ca9d' stopOpacity={0.8} />
        <stop offset='95%' stopColor='#82ca9d' stopOpacity={0} />
      </linearGradient>
    </defs>
    <XAxis dataKey='_id' />
    <YAxis yAxisId='left' label={{ value: 'Total sales', angle: -90, position: 'insideLeft' }} />
    <YAxis yAxisId='right' orientation='right' label={{ value: 'Number of orders', angle: 90, position: 'reft' }} />
    <CartesianGrid strokeDasharray='3 3' />
    <Tooltip />
    <Legend />
    <Area
      name='Total sales'
      unit='RM'
      yAxisId='left'
      type='monotone'
      dataKey='totalSaleAmount'
      stroke='#82ca9d'
      fillOpacity={1}
      fill='url(#colorArea)'
    />
    <Bar name='Order count' dataKey='count' yAxisId='right' barSize={20} fill='#413ea0' />
  </ComposedChart>
);

const StatusChart = ({ data }) => (
  <BarChart width={800} height={400} data={data}>
    <XAxis dataKey='_id' />
    <YAxis label={{ value: 'Number of orders', angle: -90, position: 'insideLeft' }} />
    <CartesianGrid strokeDasharray='3 3' />
    <Tooltip />
    <Legend />
    <Bar dataKey='Completed' stackId='a' fill='#82ca9d' />
    <Bar dataKey='Cancelled' stackId='a' fill='#8884d8' />
    <Bar dataKey='Processing' stackId='a' fill='#ffc658' />
  </BarChart>
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
  const [earningsData, setEarningsData] = useState();
  const [statusData, setStatusData] = useState();
  const [countData, setCountData] = useState([]);
  const { user } = useContext(TokenContext);

  useEffect(() => {
    axios
      .get(`${process.env.REACT_APP_API_URL}/orders/sales`)
      .then((res) => setEarningsData(res.data))
      .catch((err) => console.log(err));
    axios
      .get(`${process.env.REACT_APP_API_URL}/orders/status`)
      .then((res) => setStatusData(res.data))
      .catch((err) => console.log(err));
    axios
      .get(`${process.env.REACT_APP_API_URL}/products/count`)
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
        direction='column'
        justifyContent='flex-start'
        alignItems='center'
        spacing={5}
        width={'100%'}
        style={{ margin: '0 auto' }}
      >
        <Grid item sm={12}>
          <EarningsChart data={earningsData} />
        </Grid>
        <Grid item sm={12}>
          <StatusChart data={statusData} />
        </Grid>
        <Grid item sm={12}>
          <LowStockTable data={countData} />
        </Grid>
      </Grid>
    </div>
  ) : (
    <NotFound />
  );
}
