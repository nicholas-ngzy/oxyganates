import { useEffect, useState, useContext } from 'react';
import axios from 'axios';
import { Card, CardContent, CardHeader, Chip, Container, Grid, Typography } from '@mui/material';
import TokenContext from '../context/TokenProvider';
import NotFound from './NotFound';

export default function Order() {
  const [orders, setOrders] = useState([]);
  const { user } = useContext(TokenContext);

  useEffect(() => {
    if (user.userId === undefined) return;
    axios
      .get(`http://localhost:6969/api/v1/orders?user=${user.userId}`)
      .then((res) => setOrders(res.data))
      .catch((err) => console.log(err));
  }, [user]);

  return Object.keys(user).length > 0 ? (
    <Container>
      <Typography variant='h4' py={3} textAlign='center'>
        Order
      </Typography>
      {orders.length === 0 ? (
        <Card>
          <CardHeader title='No order yet. Start shopping now' />
        </Card>
      ) : (
        <Container>
          {orders.map((order) => {
            return (
              <Card raised key={order._id}>
                <CardHeader title={`Order ID: ${order._id}`} subheader={convertDate(order.date)} />
                <CardContent>
                  <Chip
                    label={order.status}
                    color={
                      order.status === 'Completed' ? 'success' : order.status === 'Cancelled' ? 'error' : 'warning'
                    }
                  />
                  {order.items.map((item) => {
                    return (
                      <CardContent key={item._id}>
                        <Grid container>
                          <Grid item xs={6}>
                            <Typography variant='h6'>{item.product.name}</Typography>
                          </Grid>
                          <Grid item xs={2}>
                            <Typography variant='h6'>
                              RM {(Math.round(item.product.price * 100) / 100).toFixed(2)}
                            </Typography>
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
                        <Typography variant='h5'>Total</Typography>
                      </Grid>
                      <Grid item xs={2}>
                        <Typography variant='h5'>RM {(Math.round(order.total * 100) / 100).toFixed(2)}</Typography>
                      </Grid>
                    </Grid>
                  </CardContent>
                </CardContent>
              </Card>
            );
          })}
        </Container>
      )}
    </Container>
  ) : (
    <NotFound />
  );
}

const convertDate = (date) => {
  var newDate = new Date(date);
  return newDate.toLocaleString('en-GB');
};
