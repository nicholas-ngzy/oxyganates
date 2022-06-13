import React, { useState, useEffect, useContext } from 'react';
import axios from 'axios';
import NotFound from './NotFound';
import { DataGrid, GridActionsCellItem } from '@mui/x-data-grid';
import { Typography, Paper, Grid, Popover } from '@mui/material';
import InfoIcon from '@mui/icons-material/Info';
import TokenContext from '../context/TokenProvider';
// import DeleteIcon from '@mui/icons-material/Delete';

export default function OrderDashboard() {
  const [orders, setOrders] = useState([]);
  const { token, user } = useContext(TokenContext);
  const config = { headers: { Authorization: `Bearer ${token}`, 'Content-Type': 'application/json' } };
  const columns = [
    { field: '_id', headerName: 'Order ID', flex: 1 },
    {
      field: 'date',
      headerName: 'Order date',
      type: 'date',
      flex: 1,
      valueFormatter: (params) => {
        var newDate = new Date(params.value);
        return newDate.toLocaleString('en-GB');
      },
    },
    {
      field: 'user',
      headerName: 'Customer',
      flex: 1,
      valueGetter: (params) => {
        return params.value.name;
      },
    },
    {
      field: 'status',
      headerName: 'Order status',
      type: 'singleSelect',
      valueOptions: ['Completed', 'Processing', 'Cancelled'],
      flex: 1,
      editable: true,
    },
    {
      field: 'total',
      headerName: 'Order total',
      flex: 0.5,
      valueFormatter: (params) => Number(params.value).toFixed(2),
    },
    {
      field: 'actions',
      headerName: 'Details',
      type: 'actions',
      getActions: (params) => [
        <GridActionsCellItem
          icon={<InfoIcon />}
          label='View'
          onClick={(event) => handlePopoverOpen(params.id, event)}
        />,
        // <GridActionsCellItem icon={<DeleteIcon />} label='Delete' onClick={() => handleDelete(params.id)} />,
      ],
    },
  ];

  const [anchorEl, setAnchorEl] = useState(null);
  const [items, setItems] = useState([]);
  const handlePopoverOpen = (id, event) => {
    const row = orders.find((row) => row._id === id);
    setItems(row.items);
    setAnchorEl(event.currentTarget);
  };
  const handlePopoverClose = () => setAnchorEl(null);
  const open = Boolean(anchorEl);

  const OrderItemPopover = () => (
    <Popover
      open={open}
      onClose={handlePopoverClose}
      anchorEl={anchorEl}
      anchorOrigin={{ vertical: 'center', horizontal: 'left' }}
      transformOrigin={{ vertical: 'center', horizontal: 'right' }}
      disableRestoreFocus
    >
      {items.map((item) => (
        <Grid container key={item._id} width={400}>
          <Grid item xs={1}>
            <Typography textAlign='center'>{item.quantity}</Typography>
          </Grid>
          <Grid item xs={8}>
            <Typography>{item.product.name}</Typography>
          </Grid>
          <Grid item xs={3}>
            <Typography>RM {(Math.round(item.product.price * 100) / 100).toFixed(2)}</Typography>
          </Grid>
        </Grid>
      ))}
    </Popover>
  );

  useEffect(() => {
    axios
      .get(`${process.env.REACT_APP_API_URL}/orders`)
      .then((res) => setOrders(res.data))
      .catch((err) => console.log(err));
  }, []);

  const handleUpdate = (params) => {
    axios
      .patch(`${process.env.REACT_APP_API_URL}/orders/${params.id}`, { status: params.value }, config)
      .then((res) => alert(res.data))
      .catch((err) => console.log(err));
  };

  // const handleDelete = (id) => {
  //   axios
  //     .delete(`${process.env.REACT_APP_API_URL}/orders/${id}`, config)
  //     .then((res) => {
  //       alert(res.data.message);
  //       window.location.reload();
  //     })
  //     .catch((err) => console.log(err));
  // };

  return user.isAdmin ? (
    <div>
      <Typography variant='h4' py={3} textAlign='center'>
        Orders
      </Typography>
      <Paper sx={{ width: '90%', marginX: 'auto' }}>
        <DataGrid
          autoHeight
          rows={orders}
          columns={columns}
          getRowId={(row) => row._id}
          onCellEditCommit={handleUpdate}
        />
        <OrderItemPopover />
      </Paper>
    </div>
  ) : (
    <NotFound />
  );
}
