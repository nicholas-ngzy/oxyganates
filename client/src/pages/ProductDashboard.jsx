import React, { useState, useEffect } from 'react';
import axios from 'axios';
import NotFound from './NotFound';
import jwt_decode from 'jwt-decode';
import AddProductDialog from '../components/AddProductDialog';
import { DataGrid, GridActionsCellItem, GridRowModes } from '@mui/x-data-grid';
import { Paper, Typography, Fab } from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';

export default function ProductDashboard() {
  const [products, setProducts] = useState([]);
  const [open, setOpen] = useState(false);
  const token = localStorage.getItem('token');
  const config = { headers: { Authorization: `Bearer ${token}`, 'Content-Type': 'application/json' } };
  const columns = [
    { field: '_id', headerName: 'ID', flex: 1 },
    { field: 'name', headerName: 'Product name', editable: true, flex: 1 },
    { field: 'description', headerName: 'Product description', flex: 2.5, editable: true },
    {
      field: 'category',
      headerName: 'Category',
      type: 'singleSelect',
      valueOptions: ['Seeds', 'Fertilizers', 'Pumps'],
      flex: 0.5,
      valueGetter: (params) => {
        return params.value.name;
      },
    },
    {
      field: 'price',
      headerName: 'Price',
      type: 'number',
      editable: true,
      flex: 0.5,
      valueFormatter: (params) => {
        const valueFormatted = Number(params.value).toFixed(2);
        return valueFormatted;
      },
    },
    { field: 'quantity', headerName: 'Quantity', type: 'number', flex: 0.5, editable: true },
    {
      field: 'actions',
      type: 'actions',
      getActions: (params) => [
        // <GridActionsCellItem icon={<EditIcon />} label='Edit' onClick={() => handleUpdate(params)} />,
        <GridActionsCellItem icon={<DeleteIcon />} label='Delete' onClick={() => handleDelete(params.id)} />,
      ],
    },
  ];

  useEffect(() => {
    axios
      .get('http://localhost:6969/api/v1/products')
      .then((res) => setProducts(res.data.productList))
      .catch((err) => console.log(err));
  }, []);

  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);

  const handleUpdate = (params) => {
    console.log(params);
    axios
      .put(`http://localhost:6969/api/v1/products/${params.id}`, params.row, config)
      .then((res) => alert(res.data.message))
      .catch((err) => console.log(err));
  };

  const handleDelete = (id) => {
    axios
      .delete(`http://localhost:6969/api/v1/products/${id}`, config)
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
          Products
        </Typography>
        <Fab color='primary' onClick={handleOpen}>
          <AddIcon />
        </Fab>
        <Paper sx={{ width: '90%', marginX: 'auto' }}>
          <DataGrid
            autoHeight
            pageSize={25}
            rows={products}
            columns={columns}
            getRowId={(row) => row._id}
            editMode='row'
            experimentalFeatures={{ newEditingApi: true }}
            onRowEditStop={handleUpdate}
          />
        </Paper>
        <AddProductDialog open={open} handleClose={handleClose} />
      </Paper>
    );
  } else {
    return <NotFound />;
  }
}
