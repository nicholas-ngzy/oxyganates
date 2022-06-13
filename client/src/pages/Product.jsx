import { useState, useEffect, useContext } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import axios from 'axios';
import {
  Button,
  Card,
  CardMedia,
  CardContent,
  CardActionArea,
  Container,
  Grid,
  TextField,
  Typography,
} from '@mui/material';
import TokenContext from '../context/TokenProvider';

export default function Product() {
  const [item, setItem] = useState({});
  const [products, setProducts] = useState([]);
  const { id } = useParams();
  const [error, setError] = useState(null);
  const [form, setForm] = useState({ product: id, quantity: 1 });
  const navigate = useNavigate();
  const { token, user } = useContext(TokenContext);

  useEffect(() => {
    axios
      .get(`http://localhost:6969/api/v1/products/${id}`)
      .then((res) => {
        setItem(res.data);
        const category = res.data.category.id;
        axios
          .get(`http://localhost:6969/api/v1/products?categories=${category}`)
          .then((res) => {
            for (let i = 0; i < res.data.length; i++) {
              if (res.data[i].id === id) res.data.splice(i, 1);
            }
            const random = Math.floor(Math.random() * (res.data.length - 2));
            setProducts(res.data.slice(random, random + 4));
          })
          .catch((err) => console.log(err));
      })
      .catch((err) => console.log(err));
  }, [id]);

  const handleChange = (event) => {
    const { value } = event.target;
    setError(null);
    if (value % 1) setError(`Positive integer only`);
    else setForm({ ...form, quantity: value });
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    if (token) {
      setError(null);
      if (form.quantity > item.quantity) setError(`Exceeded limit of ${item.quantity}`);
      else if (form.quantity <= 0) setError(`Minimum quantity is 1`);
      else if (form.quantity % 1) setError(`Positive integer only`);
      else {
        const config = { headers: { Authorization: `Bearer ${token}`, 'Content-Type': 'application/json' } };
        axios
          .patch(`http://localhost:6969/api/v1/cart?user=${user.userId}`, form, config)
          .then((res) => alert(res.data.message))
          .catch((err) => console.log(err));
      }
    } else navigate('/login');
  };

  return (
    <Container sx={{ padding: '8rem' }}>
      <Grid container spacing={2} paddingBottom={5}>
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
            autoComplete='off'
            onChange={handleChange}
            value={form.quantity}
            error={error}
            helperText={error || ' '}
            InputProps={{ inputProps: { min: 1, max: item.quantity } }}
          />
          <Button size='large' variant='contained' onClick={handleSubmit} sx={{ margin: '.5em' }}>
            Add to cart
          </Button>
          {item.description && (
            <Typography variant='h6' marginY={5}>
              <div dangerouslySetInnerHTML={{ __html: item.description.replace(/\\n/g, '<br>\n') }} />
            </Typography>
          )}
        </Grid>
      </Grid>
      <Typography variant='h6' marginTop={5} textAlign='center'>
        Other recommendations
      </Typography>
      <Recommendation products={products} navigate={navigate} />
    </Container>
  );
}

const Recommendation = ({ products, navigate }) => {
  return (
    <Grid
      container
      paddingY={3}
      rowSpacing={2}
      spacing={1}
      direction='row'
      justifyContent='space-evenly'
      alignItems='stretch'
    >
      {products.map((product) => (
        <Grid item key={product._id} md={3} xs={6}>
          <Card sx={{ maxWidth: 300, borderRadius: '2rem' }}>
            <CardActionArea onClick={() => navigate(`/products/${product._id}`)}>
              <CardMedia component='img' height='250' image={product.image} alt={product.name} />
              <CardContent>
                <Typography variant='h6' gutterBottom>
                  {product.name}
                </Typography>
                <Typography variant='body2' color='text.secondary'>
                  RM {product.price.toFixed(2)}
                </Typography>
              </CardContent>
            </CardActionArea>
          </Card>
        </Grid>
      ))}
    </Grid>
  );
};
