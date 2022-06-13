import React, { useState, useEffect, useContext } from 'react';
import axios from 'axios';
import NotFound from './NotFound';
import AddProductDialog from '../components/AddProductDialog';
import { DataGrid, GridActionsCellItem } from '@mui/x-data-grid';
import { Paper, Typography, Fab } from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import DeleteIcon from '@mui/icons-material/Delete';
import TokenContext from '../context/TokenProvider';

export default function ProductDashboard() {
  const [products, setProducts] = useState([]);
  const { token, user } = useContext(TokenContext);
  const config = { headers: { Authorization: `Bearer ${token}`, 'Content-Type': 'application/json' } };
  const columns = [
    { field: '_id', headerName: 'ID', flex: 1 },
    { field: 'name', headerName: 'Product name', editable: true, flex: 1 },
    { field: 'description', headerName: 'Product description', flex: 2.5, editable: true, hide: true },
    {
      field: 'category',
      headerName: 'Category',
      type: 'singleSelect',
      // valueOptions: [
      //   { label: 'Fertilizers', value: '61c42a7ae21866d19b031297' },
      //   { label: 'Grow media', value: '629d918b3bd012c4aee40fa2' },
      //   { label: 'Kits', value: '61c42a91e21866d19b031298' },
      //   { label: 'Seeds', value: '61c42a40e21866d19b031296' },
      //   { label: 'Water Pumps', value: '629f2df21cf9b04f5b8b6484' },
      // ],
      // valueOptions: [{ label: category.name, value: category._id }],
      flex: 0.5,
      // editable: true,
      valueGetter: (params) => params.value.name,
    },
    {
      field: 'price',
      headerName: 'Price',
      type: 'number',
      editable: true,
      flex: 0.5,
      valueFormatter: (params) => Number(params.value).toFixed(2),
    },
    { field: 'quantity', headerName: 'Quantity', type: 'number', flex: 0.5, editable: true },
    { field: 'image', headerName: 'Product image', flex: 2.5, editable: true, hide: true },
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
      .get(`${process.env.REACT_APP_API_URL}/products`)
      .then((res) => setProducts(res.data))
      .catch((err) => console.log(err));
  }, []);

  const [open, setOpen] = useState(false);
  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);

  const handleUpdate = (params) => {
    axios
      .put(`${process.env.REACT_APP_API_URL}/products/${params.id}`, params.row, config)
      .then((res) => alert(res.data.message))
      .catch((err) => console.log(err));
  };

  const handleDelete = (id) => {
    axios
      .delete(`${process.env.REACT_APP_API_URL}/products/${id}`, config)
      .then((res) => {
        alert(res.data);
        window.location.reload();
      })
      .catch((err) => console.log(err));
  };

  return user.isAdmin ? (
    <div>
      <Typography variant='h4' py={3} textAlign='center'>
        Products
      </Typography>
      <Fab color='primary' sx={{ position: 'absolute', top: '10%', right: '5%' }} onClick={handleOpen}>
        <AddIcon />
      </Fab>
      <Paper sx={{ width: '90%', marginX: 'auto' }}>
        <DataGrid
          autoHeight
          rows={products}
          columns={columns}
          getRowId={(row) => row._id}
          editMode='row'
          experimentalFeatures={{ newEditingApi: true }}
          onRowEditStop={handleUpdate}
        />
      </Paper>
      <AddProductDialog open={open} handleClose={handleClose} />
    </div>
  ) : (
    <NotFound />
  );
}
