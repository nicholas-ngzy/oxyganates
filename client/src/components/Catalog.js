import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Navbar from 'react-bootstrap/Navbar';
import Nav from 'react-bootstrap/Nav';
import NavDropdown from 'react-bootstrap/NavDropdown';
import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/esm/Row';
import Col from 'react-bootstrap/esm/Col';
import Card from 'react-bootstrap/Card';
import Button from 'react-bootstrap/esm/Button';
import { useNavigate } from 'react-router-dom';

const Catalog = () => {
  const [products, setProducts] = useState([]);
  const navigate = useNavigate();

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
    <div>
      <Navbar bg='dark' variant='dark' expand='md' fixed='top'>
        <Container>
          <Navbar.Brand href='/'>MEA</Navbar.Brand>
          <Nav className='me-auto'>
            <NavDropdown title='Product'>
              <NavDropdown.Item href=''>Starting Kit</NavDropdown.Item>
              <NavDropdown.Item href=''>Seeds</NavDropdown.Item>
            </NavDropdown>
            <Nav.Link href='/forum'>Forum</Nav.Link>
            <Nav.Link href='/login'>Login</Nav.Link>
          </Nav>
        </Container>
      </Navbar>
      <h1>Catalog</h1>
      <section>
        {/* <div>
          {products.map((product) => (
            <div>{product.name}</div>
          ))}
        </div> */}
        <Container>
          <Row xs={2} md={4} className='g-4'>
            {products.map((product) => {
              return (
                <Col key={product.id}>
                  <Card>
                    <Card.Img variant='top' src='{product.image}' />
                    <Card.Body>
                      <Card.Title>{product.name}</Card.Title>
                      <Card.Text>RM {product.price}</Card.Text>
                      <Card.Text>{product.description}</Card.Text>

                      <Button block onClick={() => navigate(`/${product._id}`)}>
                        View
                      </Button>
                    </Card.Body>
                  </Card>
                </Col>
              );
            })}
          </Row>
        </Container>
      </section>
    </div>
  );
};

export default Catalog;
