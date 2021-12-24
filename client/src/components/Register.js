import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate, Link } from 'react-router-dom';
import Form from 'react-bootstrap/Form';
import Button from 'react-bootstrap/Button';
import FormGroup from 'react-bootstrap/esm/FormGroup';
import FormLabel from 'react-bootstrap/esm/FormLabel';
import './Login.css';

const Register = () => {
  const navigate = useNavigate();
  const [user, setUser] = useState({
    name: '',
    email: '',
    password1: '',
    password2: '',
    phone: '',
  });

  const validateForm = () => {
    if (
      user.email.length < 1 &&
      user.name.length < 1 &&
      user.password1.length < 8 &&
      user.password2.length < 8 &&
      user.phone.length < 10
    ) {
      return alert('Please enter all fields');
    } else return 1;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setUser({
      ...user,
      [name]: value,
    });
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    try {
      register();
    } catch (e) {
      alert(e.message);
    }
  };

  const register = () => {
    axios
      .post('http://localhost:6969/api/v1/register', user)
      .then((res) => {
        alert(res.data.message);
        navigate('/login');
      })
      .catch((err) => {
        alert(err);
      });
  };

  return (
    <div className='register-wrapper'>
      <h1>Sign up</h1>
      <br />
      <h4>Please enter all details</h4>
      <br />
      <Form onSubmit={handleSubmit}>
        <Form.Group size='lg' controlId='email'>
          <Form.Label>Email</Form.Label>
          <Form.Control autoFocus name='email' type='email' value={user.email} onChange={handleChange} />
        </Form.Group>
        <br />
        <FormGroup size='lg' controlId='name'>
          <Form.Label>Name</Form.Label>
          <Form.Control name='name' type='text' value={user.name} onChange={handleChange} />
        </FormGroup>
        <br />
        <Form.Group size='lg' controlId='password1'>
          <Form.Label>Password</Form.Label>
          <Form.Control name='password1' type='password' value={user.password1} onChange={handleChange} />
        </Form.Group>
        <br />
        <Form.Group size='lg' controlId='password2'>
          <Form.Label>Confirm password</Form.Label>
          <Form.Control name='password2' type='password' value={user.password2} onChange={handleChange} />
        </Form.Group>
        <br />
        <Form.Group size='lg' controlId='phone'>
          <Form.Label>Phone</Form.Label>
          <Form.Control name='phone' type='text' value={user.phone} onChange={handleChange} />
        </Form.Group>
        <br />
        <Button block size='lg' type='submit' disabled={!validateForm}>
          Register
        </Button>
      </Form>
      <br />
      Already have an account?<Link to='/login'> Log in</Link>
    </div>
  );
};
export default Register;
