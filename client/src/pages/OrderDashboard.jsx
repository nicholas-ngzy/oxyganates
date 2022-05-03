import React, { useState, useEffect } from 'react';
import axios from 'axios';
import NotFound from './NotFound';
import jwt_decode from 'jwt-decode';
import { DataGrid, GridActionsCellItem } from '@mui/x-data-grid';
import { Typography, Paper } from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';

export default function OrderDashboard() {
  const [orders, setOrders] = useState([]);
  const token = localStorage.getItem('token');
  const config = { headers: { Authorization: `Bearer ${token}`, 'Content-Type': 'application/json' } };
  const columns = [
    { field: '_id', headerName: 'ID', flex: 1 },
    { field: 'total', headerName: 'Order total', flex: 1 },
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
      field: 'status',
      headerName: 'Order status',
      type: 'singleSelect',
      valueOptions: ['Completed', 'Processing', 'Cancelled'],
      flex: 1,
      editable: true,
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
      field: 'actions',
      type: 'actions',
      getActions: (params) => [
        <GridActionsCellItem icon={<DeleteIcon />} label='Delete' onClick={() => handleDelete(params.id)} />,
      ],
    },
  ];

  useEffect(() => {
    axios
      .get('http://localhost:6969/api/v1/orders')
      .then((res) => setOrders(res.data.orderList))
      .catch((err) => console.log(err));
  }, []);

  const handleUpdate = (params) => {
    axios
      .patch(`http://localhost:6969/api/v1/orders/${params.id}`, { status: params.value }, config)
      .then((res) => alert(res.data.message))
      .catch((err) => console.log(err));
  };

  const handleDelete = (id) => {
    axios
      .delete(`http://localhost:6969/api/v1/orders/${id}`, config)
      .then((res) => {
        alert(res.data.message);
        window.location.reload();
      })
      .catch((err) => console.log(err));
  };

  let decoded = '';
  if (token) {
    decoded = jwt_decode(token);
  }
  if (decoded.isAdmin) {
    return (
      <Paper sx={{ height: '90vh' }}>
        <Typography variant='h3' my={3} textAlign='center'>
          Orders
        </Typography>
        <Paper sx={{ width: '90%', marginX: 'auto' }}>
          <DataGrid
            autoHeight
            rows={orders}
            columns={columns}
            pageSize={25}
            getRowId={(row) => row._id}
            onCellEditCommit={handleUpdate}
          />
        </Paper>
      </Paper>
    );
  } else {
    return <NotFound />;
  }
}
