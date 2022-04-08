import React, { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import axios from 'axios';
import { Button, Card, CardActions, CardContent, CardHeader, Container, Grid, Typography } from '@mui/material';

export default function Cart() {
  const [cart, setCart] = useState([]);
  const query = new URLSearchParams(useLocation().search);
  const user = query.get('user');
  let subtotal = 0;

  useEffect(() => {
    axios
      .get(`http://localhost:6969/api/v1/cart?user=${user}`)
      .then((res) => {
        console.log(res.data);
        setCart(res.data.cart);
      })
      .catch((err) => {
        console.log(err);
      });
  }, cart);

  const handleClear = () => {
    axios
      .put(`http://localhost:6969/api/v1/cart?user=${user}`, [])
      .then((res) => {
        alert(res.data.message);
        setCart([]);
      })
      .catch((err) => {
        console.log(err);
      });
  };

  return (
    <Container>
      <Typography variant='h3' my={3} textAlign='center'>
        Cart
      </Typography>
      <Card>
        <CardHeader title='Item' />
        {cart.length === 0 && (
          <CardContent>
            <Typography>Cart is empty</Typography>
          </CardContent>
        )}
        {cart.map((item) => {
          subtotal += item.product.price * item.quantity;
          return (
            <CardContent key={item._id}>
              <Grid container>
                <Grid item xs={6}>
                  <Typography variant='h6'>{item.product.name}</Typography>
                </Grid>
                <Grid item xs={2}>
                  <Typography variant='h6'>RM {(Math.round(item.product.price * 100) / 100).toFixed(2)}</Typography>
                </Grid>
                <Grid item xs={2}>
                  <Typography variant='h6'>x {item.quantity}</Typography>
                </Grid>
                <Grid item xs={2}>
                  <Typography variant='h6'>
                    RM {(Math.round(item.product.price * item.quantity * 100) / 100).toFixed(2)}
                  </Typography>
                </Grid>
              </Grid>
            </CardContent>
          );
        })}
        <CardContent sx={{ display: 'flex', justifyContent: 'space-around' }}>
          <Grid container>
            <Grid item xs={10}>
              <Typography variant='h5'>Subtotal</Typography>
            </Grid>
            <Grid item xs={2}>
              <Typography variant='h5'>RM {(Math.round(subtotal * 100) / 100).toFixed(2)}</Typography>
            </Grid>
          </Grid>
        </CardContent>
        <CardActions>
          <Button variant='contained' size='large'>
            Checkout
          </Button>
          <Button variant='outlined' size='large' onClick={handleClear}>
            Clear Cart
          </Button>
        </CardActions>
      </Card>
    </Container>
  );
}
