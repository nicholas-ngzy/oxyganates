import React, { useState } from 'react';
import Navbar from 'react-bootstrap/Navbar';
import Nav from 'react-bootstrap/Nav';
import NavDropdown from 'react-bootstrap/NavDropdown';
import Container from 'react-bootstrap/Container';
import '../App.css';

const NavMenu = () => {
  const [token, setToken] = useState([localStorage.getItem('token')]);

  const checkLoggedIn = () => {
    if (token == '') {
      return (
        <Nav.Link href='/login' className='mx-3'>
          Login
        </Nav.Link>
      );
    } else {
      return (
        <Nav>
          <Nav.Link href='/order' className='mx-3'>
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
    <div className='py-3'>
      <Navbar bg='dark' variant='dark' expand='md' fixed='top' className='py-3'>
        <Container>
          <Navbar.Brand href='/'>MEA</Navbar.Brand>
          <Nav className='me-auto nav-item'>
            <NavDropdown title='Product' className='mx-3'>
              <NavDropdown.Item href='/categories/61c42a40e21866d19b031296'>Seeds</NavDropdown.Item>
              <NavDropdown.Item href='/categories/61c42a7ae21866d19b031297'>Fertilizers</NavDropdown.Item>
              <NavDropdown.Item href='/categories/61c42a91e21866d19b031298'>Pumps</NavDropdown.Item>
            </NavDropdown>
            <Nav.Link href='/forum' className='mx-3'>
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
