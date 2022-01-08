import React, { useState, useEffect } from 'react';
import axios from 'axios';
import NavMenu from '../NavMenu';
import { useNavigate, useParams } from 'react-router-dom';
import Row from 'react-bootstrap/esm/Row';
import Container from 'react-bootstrap/Container';
import Figure from 'react-bootstrap/Figure';
import Button from 'react-bootstrap/esm/Button';
import { Form } from 'react-bootstrap';

const Product = () => {
  const [product, setProduct] = useState({});
  const [count, setCount] = useState(1);
  let { id } = useParams();
  const navigate = useNavigate();
  const token = localStorage.getItem('token') || null;

  useEffect(() => {
    axios
      .get(`http://localhost:6969/api/v1/products/${id}`)
      .then((res) => {
        setProduct(res.data);
      })
      .catch((err) => {
        console.log(err);
      });
  }, []);

  const handleClick = () => {
    if (token) {
      console.log(id);
      let cart = [];
      if (localStorage.getItem('cart')) {
        cart = JSON.parse(localStorage.getItem('cart'));
      }
      let item = id;
      cart.push({ id: item, quantity: count });
      localStorage.setItem('cart', JSON.stringify(cart));
    } else {
      navigate('/login');
    }
    // axios
    //   .post(`http://localhost:6969/api/v1/cart/${id}`)
    //   .then((res) => {
    //     alert(res.data.message);
    //   })
    //   .catch((err) => {
    //     console.log(err);
    //   });
  };

  return (
    <div>
      <NavMenu />
      <div className='p-5'>
        <Container style={{ display: 'flex', flexDirection: 'row', justifyContent: 'space-around' }}>
          <Figure style={{ alignSelf: 'flex-start' }}>
            <Figure.Image src={product.image} width={500} height={500} alt={product.name}></Figure.Image>
          </Figure>
          <div>
            <Row className='h2 py-2'>{product.name}</Row>
            <Row className='h3 py-2'>RM {(Math.round(product.price * 100) / 100).toFixed(2)}</Row>
            <Row className='py-2'>{product.description}</Row>
            <Row className='py-2'>
              <Form>
                <Form.Control
                  type='number'
                  min={1}
                  max={product.quantity}
                  placeholder={count}
                  onChange={setCount}
                ></Form.Control>
              </Form>
              <Button className='mx-2' onClick={handleClick}>
                Add to cart
              </Button>
            </Row>
          </div>
        </Container>
      </div>
    </div>
  );
};

export default Product;
