import { useEffect, useState } from 'react';
import axios from 'axios';
import { Card, CardContent, CardHeader, Chip, Collapse, Container, Typography } from '@mui/material';

export default function Order() {
  const [orders, setOrders] = useState([]);

  useEffect(() => {
    axios
      .get('http://localhost:6969/api/v1/orders')
      .then((res) => {
        setOrders(res.data.orderList);
      })
      .catch((err) => {
        console.log(err);
      });
  }, []);

  return (
    <Container>
      <Typography variant='h3' my={3} textAlign='center'>
        Order
      </Typography>
      {orders.map((order) => {
        return (
          <Card raised key={order._id}>
            <CardHeader title={order._id} subheader={convertDate(order.date)}></CardHeader>
            <CardContent>
              <Chip
                label={order.status}
                color={order.status === 'Success' ? 'success' : order.status === 'Processing' ? 'warning' : 'error'}
              ></Chip>
              <Typography>RM {order.total}</Typography>
            </CardContent>
            <CardContent>
              <Collapse in={true}>
                <Typography>{order.total}</Typography>
              </Collapse>
            </CardContent>
          </Card>
        );
      })}
    </Container>
  );
}

const convertDate = (date) => {
  var newDate = new Date(date);
  return newDate.toLocaleString('en-GB');
};
