import React, { useState, useEffect } from 'react';
import axios from 'axios';
import NavMenu from '../NavMenu';
import { useParams } from 'react-router-dom';
import Col from 'react-bootstrap/esm/Col';
import Row from 'react-bootstrap/esm/Row';
import Container from 'react-bootstrap/Container';
import Figure from 'react-bootstrap/Figure';
import Button from 'react-bootstrap/esm/Button';
import { Form } from 'react-bootstrap';

const Product = () => {
  const [product, setProduct] = useState([]);
  const [count, setCount] = useState(1);
  let { id } = useParams();

  useEffect(() => {
    axios
      .get(`http://localhost:6969/api/v1/products/${id}`)
      .then((res) => {
        setProduct(res.data);
        console.log(product);
      })
      .catch((err) => {
        console.log(err);
      });
  }, []);

  const handleClick = () => {
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
        <Container>
          <Col>
            <Figure>
              <Figure.Image src='{product.image}' width={300} height={300} alt={product.name}></Figure.Image>
            </Figure>
          </Col>
          <Col>
            <Row className='h2'>{product.name}</Row>
            <Row className='h3'>RM {product.price}</Row>
            <Row>{product.description}</Row>
            <Row>
              <Form>
                <Form.Control
                  type='number'
                  min={1}
                  max={product.quantity}
                  placeholder={count}
                  onChange={setCount}
                ></Form.Control>
              </Form>
              <Button onClick={handleClick}>Add to cart</Button>
            </Row>
          </Col>
        </Container>
      </div>
    </div>
  );
};

export default Product;
