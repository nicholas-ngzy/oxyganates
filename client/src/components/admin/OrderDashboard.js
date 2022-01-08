import React, { useState, useEffect } from 'react';
import axios from 'axios';
import NavMenu from '../NavMenu';
import { DataGrid } from '@mui/x-data-grid';
import { Stack, Button } from '@mui/material';

const OrderDashboard = () => {
  const [orders, setOrders] = useState([]);
  const [selection, setSelection] = useState([]);
  const token = localStorage.getItem('token');
  const config = { headers: { Authorization: `Bearer ${token}`, 'Content-Type': 'application/json' } };
  const columns = [
    { field: '_id', headerName: 'ID', flex: 1 },
    {
      field: 'total',
      headerName: 'Order total',
      flex: 1,
    },
    {
      field: 'status',
      headerName: 'Order status',
      flex: 1,
      editable: true,
    },
    {
      field: 'date',
      headerName: 'Order date',
      type: 'date',
      flex: 1,
    },
    {
      field: 'user',
      headerName: 'Customer',
      flex: 1,
      valueGetter: (params) => {
        return params.value.name;
      },
    },
  ];

  useEffect(() => {
    axios
      .get('http://localhost:6969/api/v1/orders')
      .then((res) => {
        setOrders(res.data.orderList);
        console.log(orders);
      })
      .catch((err) => {
        console.log(err);
      });
  }, []);

  const handleAddRow = () => {};
  const handleDeleteRow = () => {
    axios
      .all(selection.map((selection) => axios.delete(`http://localhost:6969/api/v1/orders/${selection}`, config)))
      .then((res) => {
        alert(res[0].data.message);
        window.location.reload();
      })
      .catch((err) => {
        console.log(err);
      });
  };

  return (
    <div>
      <NavMenu />
      <div>
        <div className='h1 py-4'>Orders</div>
        <div style={{ height: '80vh', width: '90%', margin: '1px auto' }}>
          <Stack sx={{ width: '100%', mb: 1 }} direction='row' alignItems='flex-start' columnGap={1}>
            <Button size='large' variant='outlined' onClick={handleDeleteRow}>
              Delete order
            </Button>
            <Button size='large' variant='outlined' onClick={handleAddRow}>
              Create order
            </Button>
          </Stack>
          <DataGrid
            autoHeight
            rows={orders}
            columns={columns}
            getRowId={(row) => row._id}
            pageSize={10}
            checkboxSelection
            disableSelectionOnClick
            onSelectionModelChange={(ids) => {
              setSelection(ids);
              console.log(selection);
            }}
          ></DataGrid>
        </div>
      </div>
    </div>
  );
};

export default OrderDashboard;

{
  /* <Table striped bordered>
  <thead>
    <tr>
      <th>Id</th>
      <th>Total</th>
      <th>Status</th>
      <th>Date</th>
    </tr>
  </thead>
  <tbody>
    {orders.map((order) => {
      return (
        <tr key={order._id}>
          <td>{order._id}</td>
          <td>{order.total}</td>
          <td>{order.status}</td>
          <td>{order.date}</td>
        </tr>
      );
    })}
  </tbody>
</Table> */
}
