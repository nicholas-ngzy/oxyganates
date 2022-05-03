import React, { useState } from 'react';
import axios from 'axios';
import { Button, TextField, Dialog, DialogTitle, DialogContent, DialogActions, MenuItem } from '@mui/material';

export default function AddProductDialog(props) {
  const [form, setForm] = useState({});
  const [errors, setErrors] = useState({});
  const token = localStorage.getItem('token');
  const config = { headers: { Authorization: `Bearer ${token}`, 'Content-Type': 'application/json' } };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm({
      ...form,
      [name]: value,
    });
    setErrors({
      ...errors,
      [name]: null,
    });
  };

  const findError = () => {
    const { name, description, price, quantity, category } = form;
    const newErrors = {};
    if (!category || category === '') newErrors.category = 'Required field';
    if (!name || name === '') newErrors.name = 'Required field';
    if (!description || description === '') newErrors.description = 'Required field';
    if (!price || price === '') newErrors.price = 'Required field';
    if (!quantity || quantity === '') newErrors.quantity = 'Required field';
    return newErrors;
  };

  const handleSubmit = () => {
    const json = JSON.stringify(form);
    const newErrors = findError();
    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
    } else {
      axios
        .post(`http://localhost:6969/api/v1/products`, json, config)
        .then((res) => window.location.reload())
        .catch((err) => console.log(err));
    }
  };

  return (
    <Dialog maxWidth='md' fullWidth open={props.open} onClose={props.handleClose}>
      <DialogTitle>Add product</DialogTitle>
      <DialogContent>
        <TextField
          required
          select
          label='Category'
          name='category'
          fullWidth
          margin='normal'
          value={form.category}
          onChange={handleChange}
          error={errors.category}
          helperText={errors.category || ' '}
        >
          <MenuItem value={'61c42a7ae21866d19b031297'}>Fertilizers</MenuItem>
          <MenuItem value={'61c42a91e21866d19b031298'}>Kits</MenuItem>
          <MenuItem value={'61c42a40e21866d19b031296'}>Seeds</MenuItem>
        </TextField>
        <TextField
          required
          label='Name'
          name='name'
          fullWidth
          margin='normal'
          inputProps={{ style: { fontSize: 24 } }}
          value={form.name}
          onChange={handleChange}
          error={errors.name}
          helperText={errors.name || ' '}
        />
        <TextField
          required
          label='Description'
          name='description'
          fullWidth
          margin='normal'
          inputProps={{ style: { fontSize: 24 } }}
          value={form.description}
          onChange={handleChange}
          error={errors.description}
          helperText={errors.description || ' '}
        />
        <TextField
          required
          label='Price'
          name='price'
          fullWidth
          margin='normal'
          inputProps={{
            style: { fontSize: 24 },
            inputMode: 'decimal',
            pattern: '([0-9]+)?[,\\.]?[0-9]*',
            inputProps: {
              min: 0.01,
            },
          }}
          value={form.price}
          onChange={handleChange}
          error={errors.price}
          helperText={errors.price || ' '}
        />
        <TextField
          required
          label='Quantity'
          name='quantity'
          fullWidth
          margin='normal'
          inputProps={{
            style: { fontSize: 24 },
            inputMode: 'numeric',
            pattern: '[0-9]*',
            inputProps: {
              min: 1,
            },
          }}
          value={form.quantity}
          onChange={handleChange}
          error={errors.quantity}
          helperText={errors.quantity || ' '}
        />
      </DialogContent>
      <DialogActions>
        <Button onClick={props.handleClose}>Cancel</Button>
        <Button onClick={handleSubmit}>Add</Button>
      </DialogActions>
    </Dialog>
  );
}
