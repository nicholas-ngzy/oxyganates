import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import axios from 'axios';
import { Button, Container, Grid, TextField, Typography } from '@mui/material';
import jwt_decode from 'jwt-decode';

export default function Product() {
  const [item, setItem] = useState({});
  const [count, setCount] = useState(1);
  const { id } = useParams();
  const [form, setForm] = useState({
    product: id,
    quantity: count,
  });
  const navigate = useNavigate();
  const token = localStorage.getItem('token') || null;

  useEffect(() => {
    axios
      .get(`http://localhost:6969/api/v1/products/${id}`)
      .then((res) => {
        setItem(res.data);
      })
      .catch((err) => {
        console.log(err);
      });
  }, []);

  const handleChange = (e) => {
    const { value } = e.target;
    setCount(value);
    setForm({
      ...form,
      quantity: value,
    });
  };
  const handleClick = () => {
    if (token) {
      const config = { headers: { Authorization: `Bearer ${token}`, 'Content-Type': 'application/json' } };
      const user = jwt_decode(localStorage.getItem('token')).userId;
      axios
        .patch(`http://localhost:6969/api/v1/cart?user=${user}`, form, config)
        .then((res) => {
          console.log(res.data);
          alert(res.data.message);
        })
        .catch((err) => {
          console.log(err);
        });
    } else {
      navigate('/login');
    }
  };

  return (
    <Container sx={{ padding: '8rem' }}>
      <Grid container spacing={2}>
        <Grid item xs={12} md={6}>
          <img src={item.image} width={'90%'} height={'90%'} alt={item.name} />
        </Grid>
        <Grid item xs={12} md={6}>
          <Typography variant='h4'>{item.name}</Typography>
          <Typography variant='h5' marginBottom={3}>
            RM {(Math.round(item.price * 100) / 100).toFixed(2)}
          </Typography>
          <TextField
            label='Quantity'
            type='number'
            name='quantity'
            onChange={handleChange}
            InputProps={{
              inputProps: {
                min: 1,
                max: item.quantity,
                defaultValue: count,
              },
            }}
          ></TextField>
          <Button size='large' variant='contained' onClick={handleClick} sx={{ margin: '.5em' }}>
            Add to cart
          </Button>
          <Typography variant='h6' marginY={5}>
            {item.description}
          </Typography>
        </Grid>
      </Grid>
    </Container>
  );
}
