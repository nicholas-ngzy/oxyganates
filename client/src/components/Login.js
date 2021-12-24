import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate, Link } from 'react-router-dom';
import Form from 'react-bootstrap/Form';
import Button from 'react-bootstrap/Button';
import './Login.css';

const Login = ({ setToken }) => {
  const navigate = useNavigate();
  const [user, setUser] = useState({
    email: '',
    password: '',
  });

  const validateForm = () => {
    return user.email.length > 0 && user.password.length >= 8;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setUser({
      ...user, //spread operator
      [name]: value,
    });
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    try {
      login();
    } catch (e) {
      alert(e.message);
    }
  };

  const login = () => {
    axios
      .post('http://localhost:6969/api/v1/login', user)
      .then((res) => {
        alert(res.data.message);
        setToken(res.data.token);
        localStorage.setItem('token', res.data.token);
        navigate('/homepage');
      })
      .catch((err) => {
        console.log(err);
      });
  };

  return (
    <div className='login-wrapper'>
      <h1>Log in</h1>
      <br />
      <h4>Please enter your email and password</h4>
      <br />
      <Form onSubmit={handleSubmit}>
        <Form.Group size='lg' controlId='email'>
          <Form.Label>Email</Form.Label>
          <Form.Control autoFocus name='email' type='email' value={user.email} onChange={handleChange} />
        </Form.Group>
        <br />
        <Form.Group size='lg' controlId='password'>
          <Form.Label>Password</Form.Label>
          <Form.Control name='password' type='password' value={user.password} onChange={handleChange} />
        </Form.Group>
        <br />
        <Button block size='lg' type='submit' disabled={!validateForm}>
          Login
        </Button>
      </Form>
      <br />
      Don't have an account? <Link to='/register'>Sign up</Link>
    </div>
  );
};
export default Login;
