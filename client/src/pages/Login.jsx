import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import axios from 'axios';
import '../App.css';
import Form from 'react-bootstrap/Form';
import { Button, Typography } from '@mui/material';

export default function Login({ setToken }) {
  const navigate = useNavigate();
  const [form, setForm] = useState({});
  const [errors, setErrors] = useState({});

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm({
      ...form, //spread operator
      [name]: value,
    });
    // clear error
    setErrors({
      ...errors,
      [name]: null,
    });
  };

  const findError = () => {
    const { email, password } = form;
    const newErrors = {};
    if (!email || email === '') newErrors.email = 'Required field';
    if (!password || password === '') newErrors.password = 'Required field';
    return newErrors;
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    const newErrors = findError();
    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
    } else {
      try {
        login();
      } catch (e) {
        console.log(e.message);
      }
    }
  };

  const login = () => {
    axios
      .post('http://localhost:6969/api/v1/login', form)
      .then((res) => {
        alert(res.data.message);
        setToken(res.data.token);
        localStorage.setItem('token', res.data.token);
        navigate('/');
      })
      .catch((err) => {
        if (err.response.status == '400') alert('Wrong credentials');
        if (err.response.status == '404') alert('User not found');
        console.log(err);
      });
  };

  return (
    <div className='login-wrapper'>
      <Typography variant='h3' marginY={3}>
        Log in
      </Typography>
      <Typography variant='h5'>Please enter email and password</Typography>
      <Form onSubmit={handleSubmit} className='my-4'>
        <Form.Group size='lg' controlId='email' className='my-4'>
          <Form.Label>Email</Form.Label>
          <Form.Control
            autoFocus
            name='email'
            type='email'
            value={form.email}
            onChange={handleChange}
            isInvalid={!!errors.email}
          />
          <Form.Control.Feedback type='invalid'>{errors.email}</Form.Control.Feedback>
        </Form.Group>
        <Form.Group size='lg' controlId='password' className='my-4'>
          <Form.Label>Password</Form.Label>
          <Form.Control
            name='password'
            type='password'
            value={form.password}
            onChange={handleChange}
            isInvalid={!!errors.password}
          />
          <Form.Control.Feedback type='invalid'>{errors.password}</Form.Control.Feedback>
        </Form.Group>
        <Button variant='contained' onClick={handleSubmit}>
          Login
        </Button>
      </Form>
      <Typography variant='h6'>
        Don't have an account? <Link to='/register'>Sign up</Link>
      </Typography>
    </div>
  );
}
