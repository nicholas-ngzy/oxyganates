import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/esm/Row';
import Col from 'react-bootstrap/esm/Col';
import Card from 'react-bootstrap/Card';
import Button from 'react-bootstrap/esm/Button';
import { Link } from 'react-router-dom';
import NavMenu from '../NavMenu';

const Catalog = () => {
  const [products, setProducts] = useState([]);

  useEffect(() => {
    axios
      .get('http://localhost:6969/api/v1/products')
      .then((res) => {
        setProducts(res.data.productList);
        console.log(products);
      })
      .catch((err) => {
        console.log(err);
      });
  }, []);

  return (
    <div className='p-3'>
      <NavMenu />
      <h1>Catalog</h1>
      <Container>
        <Row xs={2} md={4} className='g-4'>
          {products.map((product) => {
            return (
              <Col key={product.id}>
                <Card>
                  <Card.Img variant='top' src='{product.image}' />
                  <Card.Body>
                    <Card.Title>{product.name}</Card.Title>
                    <Card.Text>RM {product.price.toFixed(2)}</Card.Text>
                    <Card.Text>{product.description}</Card.Text>
                    <Link to={`/products/${product._id}`}>
                      <Button>View</Button>
                    </Link>
                  </Card.Body>
                </Card>
              </Col>
            );
          })}
        </Row>
      </Container>
    </div>
  );
};

export default Catalog;
