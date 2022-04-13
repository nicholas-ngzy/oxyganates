import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import axios from 'axios';
import { Button, Container, TextField, Typography } from '@mui/material';

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
        if (err.response.status === 400) alert('Wrong credentials');
        if (err.response.status === 404) alert('User not found');
        console.log(err);
      });
  };

  return (
    <Container sx={{ textAlign: 'center', width: '50%' }}>
      <Typography variant='h3' marginTop={5}>
        Log in
      </Typography>
      <Typography variant='h5' marginY={3}>
        Please enter email and password
      </Typography>
      <TextField
        autoFocus
        required
        id='standard-required'
        label='Email'
        name='email'
        margin='normal'
        fullWidth
        inputProps={{ style: { fontSize: 24 } }}
        inputLabelProps={{ style: { fontSize: 24 } }}
        value={form.email}
        onChange={handleChange}
        error={errors.email}
        helperText={errors.email || ' '}
      ></TextField>
      <TextField
        required
        id='standard-password-input'
        type='password'
        label='Password'
        name='password'
        margin='normal'
        fullWidth
        inputProps={{ style: { fontSize: 24 } }}
        inputLabelProps={{ style: { fontSize: 24 } }}
        value={form.password}
        onChange={handleChange}
        error={errors.password}
        helperText={errors.password || ' '}
      ></TextField>
      <Button variant='contained' size='large' onClick={handleSubmit} sx={{ margin: '1.5rem' }}>
        Login
      </Button>
      <Typography variant='h6'>
        Don't have an account? <Link to='/register'>Sign up</Link>
      </Typography>
    </Container>
  );
}
