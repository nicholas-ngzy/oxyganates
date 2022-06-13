import React, { useState, useEffect, useContext } from 'react';
import axios from 'axios';
import { Button, TextField, Dialog, DialogTitle, DialogContent, DialogActions, MenuItem } from '@mui/material';
import TokenContext from '../context/TokenProvider';

export default function AddProductDialog(props) {
  const [form, setForm] = useState({ name: '', description: '', price: '', quantity: '', category: '', image: '' });
  const [categories, setCategories] = useState([]);
  const [errors, setErrors] = useState({});
  const { token } = useContext(TokenContext);
  const config = { headers: { Authorization: `Bearer ${token}`, 'Content-Type': 'application/json' } };

  const handleChange = (event) => {
    const { name, value } = event.target;
    setForm({ ...form, [name]: value });
    setErrors({ ...errors, [name]: null });
  };

  const findError = () => {
    const { name, description, price, quantity, category, image } = form;
    const newErrors = {};
    if (!category || category === '') newErrors.category = 'Required field';
    if (!name || name === '') newErrors.name = 'Required field';
    if (!description || description === '') newErrors.description = 'Required field';
    if (!price || price === '') newErrors.price = 'Required field';
    if (!image || image === '') newErrors.image = 'Required field';
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

  useEffect(() => {
    axios
      .get(`http://localhost:6969/api/v1/categories`)
      .then((res) => setCategories(res.data))
      .catch((err) => console.log(err));
  }, []);

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
          error={Boolean(errors.category)}
          helperText={errors.category || ' '}
        >
          {categories.map((category) => (
            <MenuItem key={category.id} value={category.id}>
              {category.name}
            </MenuItem>
          ))}
        </TextField>
        <TextField
          required
          label='Name'
          name='name'
          fullWidth
          value={form.name}
          onChange={handleChange}
          error={Boolean(errors.name)}
          helperText={errors.name || ' '}
        />
        <TextField
          required
          multiline
          label='Description'
          name='description'
          fullWidth
          value={form.description}
          onChange={handleChange}
          error={Boolean(errors.description)}
          helperText={errors.description || ' '}
        />
        <TextField
          required
          label='Image'
          name='image'
          fullWidth
          value={form.image}
          onChange={handleChange}
          error={Boolean(errors.image)}
          helperText={errors.image || ' '}
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
          error={Boolean(errors.price)}
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
          error={Boolean(errors.quantity)}
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
