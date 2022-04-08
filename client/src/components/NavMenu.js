import React, { useState, useEffect } from 'react';
import axios from 'axios';
import '../App.css';
import Nav from 'react-bootstrap/Nav';
import Navbar from 'react-bootstrap/Navbar';
import Container from 'react-bootstrap/Container';
import NavDropdown from 'react-bootstrap/NavDropdown';
import jwt_decode from 'jwt-decode';

const NavMenu = () => {
  const [token, setToken] = useState(localStorage.getItem('token'));
  const [categories, setCategories] = useState([]);

  let decoded = '';
  if (token) {
    decoded = jwt_decode(token);
  }

  // useEffect(() => {
  //   axios
  //     .get(`http://localhost:6969/api/v1/categories`)
  //     .then((res) => {
  //       setCategories(res.data);
  //     })
  //     .catch((err) => {
  //       console.log(err);
  //     });
  //   return () => {
  //     setCategories(null);
  //   };
  // }, []);

  const checkLoggedIn = () => {
    if (token == null) {
      return (
        <Nav>
          <NavDropdown title='Product' className='mx-3'>
            {/* {categories.map((category) => {
              return ( */}

            {/* <NavDropdown.Item key={category._id} href={`/products/?categories=${category._id}`}>
               {category.name}
            </NavDropdown.Item> */}
            <NavDropdown.Item href={`/products/?categories=61c42a40e21866d19b031296`}>Seeds</NavDropdown.Item>
            <NavDropdown.Item href={`/products/?categories=61c42a7ae21866d19b031297`}>Fertilizers</NavDropdown.Item>
            <NavDropdown.Item href={`/products/?categories=61c42a91e21866d19b031298`}>Kits</NavDropdown.Item>
            {/* ); */}
            {/* })} */}
          </NavDropdown>
          <Nav.Link href='/login' className='mx-3'>
            Login
          </Nav.Link>
        </Nav>
      );
    } else if (decoded.isAdmin) {
      return (
        <Nav>
          <Nav.Link href='/admin/products' className='mx-3'>
            Product
          </Nav.Link>
          <Nav.Link href='/admin/orders' className='mx-3'>
            Order
          </Nav.Link>
          <Nav.Link
            href='/'
            className='mx-3'
            onClick={() => {
              localStorage.removeItem('token');
              setToken('');
            }}
          >
            Logout
          </Nav.Link>
        </Nav>
      );
    } else {
      return (
        <Nav>
          <NavDropdown title='Product' className='mx-3'>
            {/* {categories.map((category) => {
              return (
                <NavDropdown.Item key={category._id} href={`/products/?categories=${category._id}`}>
                  {category.name}
                </NavDropdown.Item>
              );
            })} */}
            <NavDropdown.Item href={`/products/?categories=61c42a40e21866d19b031296`}>Seeds</NavDropdown.Item>
            <NavDropdown.Item href={`/products/?categories=61c42a7ae21866d19b031297`}>Fertilizers</NavDropdown.Item>
            <NavDropdown.Item href={`/products/?categories=61c42a91e21866d19b031298`}>Kits</NavDropdown.Item>
          </NavDropdown>
          <Nav.Link href={`/cart/?user=${decoded.userId}`} className='mx-3'>
            Cart
          </Nav.Link>
          <Nav.Link href='/orders' className='mx-3'>
            Order
          </Nav.Link>
          <Nav.Link
            href='/'
            className='mx-3'
            onClick={() => {
              localStorage.removeItem('token');
              setToken('');
            }}
          >
            Logout
          </Nav.Link>
        </Nav>
      );
    }
  };
  return (
    <div>
      <Navbar bg='dark' variant='dark' expand='md' fixed='top' className='py-3'>
        <Container>
          <Navbar.Brand href='/'>Oxyganates</Navbar.Brand>
          <Nav className='me-auto nav-item'>
            <Nav.Link href='/posts' className='mx-3'>
              Forum
            </Nav.Link>
            {checkLoggedIn()}
          </Nav>
        </Container>
      </Navbar>
    </div>
  );
};
export default NavMenu;
