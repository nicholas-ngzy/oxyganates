import React, { useState, useEffect, useContext } from 'react';
import axios from 'axios';
import { Button, Card, CardActions, CardContent, CardHeader, Container, Grid, Typography } from '@mui/material';
import Paypal from '../components/Paypal';
import TokenContext from '../context/TokenProvider';

export default function Cart() {
  const [cart, setCart] = useState([]);
  const { user } = useContext(TokenContext);
  let subtotal = 0;

  useEffect(() => {
    axios
      .get(`http://localhost:6969/api/v1/cart?user=${user.userId}`)
      .then((res) => setCart(res.data.cart))
      .catch((err) => console.log(err));
  }, [user]);

  const handleClear = () => {
    axios
      .put(`http://localhost:6969/api/v1/cart?user=${user.userId}`, [])
      .then((res) => setCart([]))
      .catch((err) => console.log(err));
  };

  return (
    <Container>
      <Typography variant='h4' py={3} textAlign='center'>
        Cart
      </Typography>
      <Card>
        {cart.length === 0 ? (
          <CardHeader title='Cart is empty' />
        ) : (
          <CardContent>
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
              <Button variant='outlined' size='large' onClick={handleClear}>
                Clear Cart
              </Button>
            </CardActions>
            <CardContent sx={{ textAlign: 'center' }}>
              <Paypal cart={cart} subtotal={subtotal} user={user.userId} handleClear={handleClear} />
            </CardContent>
          </CardContent>
        )}
      </Card>
    </Container>
  );
}
