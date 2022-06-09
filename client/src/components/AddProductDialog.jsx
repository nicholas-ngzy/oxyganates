import React, { useState, useContext } from 'react';
import axios from 'axios';
import { Button, TextField, Dialog, DialogTitle, DialogContent, DialogActions, MenuItem } from '@mui/material';
import TokenContext from '../context/TokenProvider';

export default function AddProductDialog(props) {
  const [form, setForm] = useState({});
  const [errors, setErrors] = useState({});
  const { token } = useContext(TokenContext);
  const config = { headers: { Authorization: `Bearer ${token}`, 'Content-Type': 'application/json' } };

  const handleChange = (event) => {
    const { name, value } = event.target;
    setForm({ ...form, [name]: value });
    setErrors({ ...errors, [name]: null });
  };

  const findError = () => {
    const { name, description, price, quantity, category } = form;
    const newErrors = {};
    if (!category || category === '') newErrors.category = 'Required field';
    if (!name || name === '') newErrors.name = 'Required field';
    if (!description || description === '') newErrors.description = 'Required field';
    if (!price || price === '') newErrors.price = 'Required field';
    else if (isNaN(price) || price <= 0) newErrors.price = 'Positive number only';
    if (!quantity || quantity === '') newErrors.quantity = 'Required field';
    else if (!Number.isInteger(Number(quantity)) || quantity <= 0) newErrors.quantity = 'Positive integer only';
    return newErrors;
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    const newErrors = findError();
    if (Object.keys(newErrors).length > 0) setErrors(newErrors);
    else {
      axios
        .post(`http://localhost:6969/api/v1/products`, form, config)
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
          inputProps={{
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
          inputProps={{
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
