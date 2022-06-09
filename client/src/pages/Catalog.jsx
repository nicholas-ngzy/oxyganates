import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Container, Typography, Card, CardActionArea, CardContent, CardMedia, Grid, Tabs, Tab } from '@mui/material';
import { useNavigate } from 'react-router-dom';

export default function Catalog() {
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [value, setValue] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    axios
      .get(`http://localhost:6969/api/v1/products?categories=${value}`)
      .then((res) => setProducts(res.data))
      .catch((err) => console.log(err));
  }, [value]);

  useEffect(() => {
    axios
      .get(`http://localhost:6969/api/v1/categories`)
      .then((res) => setCategories(res.data))
      .catch((err) => console.log(err));
  }, []);

  return (
    <Container>
      <Tabs value={value} onChange={(event, value) => setValue(value)} variant='scrollable' scrollButtons='auto'>
        <Tab label='All products' value='' />
        {categories.map((category) => (
          <Tab label={category.name} value={category._id} key={category._id} />
        ))}
      </Tabs>
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
            <Card sx={{ maxWidth: 300 }}>
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
    </Container>
  );
}
