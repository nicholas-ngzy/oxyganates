import React from 'react';
import Navbar from 'react-bootstrap/Navbar';
import Nav from 'react-bootstrap/Nav';
import NavDropdown from 'react-bootstrap/NavDropdown';
import Container from 'react-bootstrap/Container';

const NavMenu = () => {
  return (
    <Navbar bg='dark' variant='dark' expand='md' fixed='top'>
      <Container>
        <Navbar.Brand href='/homepage'>MEA</Navbar.Brand>
        <Nav className='me-auto'>
          <NavDropdown title='Product'>
            <NavDropdown.Item href=''>Starting Kit</NavDropdown.Item>
            <NavDropdown.Item href=''>Seeds</NavDropdown.Item>
          </NavDropdown>
          <Nav.Link href='/order'>Order</Nav.Link>
          <Nav.Link href='/forum'>Forum</Nav.Link>
          <Nav.Link
            href='/'
            onClick={() => {
              localStorage.removeItem('token');
            }}
          >
            Logout
          </Nav.Link>
        </Nav>
      </Container>
    </Navbar>
  );
};
export default NavMenu;
