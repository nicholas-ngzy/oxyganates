import { useState, useEffect, useContext } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import axios from 'axios';
import { Button, Container, Grid, TextField, Typography } from '@mui/material';
import TokenContext from '../context/TokenProvider';

export default function Product() {
  const [item, setItem] = useState({});
  const [count, setCount] = useState(1);
  const { id } = useParams();
  const [form, setForm] = useState({ product: id });
  const navigate = useNavigate();
  const { token, user } = useContext(TokenContext);

  useEffect(() => {
    axios
      .get(`http://localhost:6969/api/v1/products/${id}`)
      .then((res) => setItem(res.data))
      .catch((err) => console.log(err));
  }, []);

  const handleChange = (event) => {
    const { value } = event.target;
    if (value > item.quantity) alert(`Exceeded limit of ${item.quantity}`);
    else if (value <= 0) alert(`Minimum quantity is 1`);
    else if (!Number.isInteger(value)) alert(`Positive integer only`);
    else {
      setCount(value);
      setForm({ ...form, quantity: value });
    }
  };

  const handleClick = () => {
    if (token) {
      if (form.quantity <= item.quantity && form.quantity !== '') {
        const config = { headers: { Authorization: `Bearer ${token}`, 'Content-Type': 'application/json' } };
        axios
          .patch(`http://localhost:6969/api/v1/cart?user=${user.userId}`, form, config)
          .then((res) => alert(res.data.message))
          .catch((err) => console.log(err));
      } else if (form.quantity > item.quantity) alert(`Exceeded limit of ${item.quantity}`);
      else if (!Number.isInteger(form.quantity)) alert(`Positive integer only`);
      else if (form.quantity <= 0) alert(`Minimum quantity is 1`);
      else alert(`No quantity selected`);
    } else navigate('/login');
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
            InputProps={{ inputProps: { min: 1, max: item.quantity, defaultValue: count } }}
          />
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
