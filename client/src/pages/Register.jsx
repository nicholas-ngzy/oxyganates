import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import axios from 'axios';
import { Button, Container, TextField, Typography } from '@mui/material';

export default function Register() {
  const navigate = useNavigate();
  const [form, setForm] = useState({ email: '', password1: '', name: '', password2: '' });
  const [errors, setErrors] = useState({});

  const handleChange = (event) => {
    const { name, value } = event.target;
    setForm({ ...form, [name]: value });
    setErrors({ ...errors, [name]: null }); //clear errors
  };

  const findError = () => {
    const { email, name, password1, password2 } = form;
    const newErrors = {};
    if (!email || email === '') newErrors.email = 'Required field';
    if (!name || name === '') newErrors.name = 'Required field';
    if (!password1 || password1 === '') newErrors.password1 = 'Required field';
    if (password1 !== password2) newErrors.password2 = 'Does not match';
    if (!password2 || password2 === '') newErrors.password2 = 'Required field';
    if (password1) {
      if (password1.length < 8) newErrors.password1 = 'Minimum 8 characters';
    }
    if (password2) {
      if (password2.length < 8) newErrors.password2 = 'Minimum 8 characters';
    }
    return newErrors;
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    const newErrors = findError();
    if (Object.keys(newErrors).length > 0) setErrors(newErrors);
    else {
      try {
        register();
      } catch (err) {
        console.log(err.message);
      }
    }
  };

  const register = () => {
    axios
      .post(`${process.env.REACT_APP_API_URL}/register`, form)
      .then((res) => {
        alert(res.data.message);
        navigate('/login');
      })
      .catch((err) => {
        if (err.response.status === 403) alert('Email already exist');
        else alert(err);
      });
  };

  return (
    <Container sx={{ textAlign: 'center', width: '50%' }}>
      <Typography variant='h4' marginTop={4}>
        Sign Up
      </Typography>
      <Typography variant='h6' marginTop={1} marginBottom={5}>
        Please enter all details
      </Typography>
      <TextField
        autoFocus
        required
        label='Email'
        name='email'
        fullWidth
        value={form.email}
        onChange={handleChange}
        error={errors.email}
        helperText={errors.email || ' '}
      />
      <TextField
        required
        label='Name'
        name='name'
        fullWidth
        value={form.name}
        onChange={handleChange}
        error={errors.name}
        helperText={errors.name || ' '}
      />
      <TextField
        required
        type='password'
        label='Password'
        name='password1'
        fullWidth
        value={form.password1}
        onChange={handleChange}
        error={errors.password1}
        helperText={errors.password1 || ' '}
      />
      <TextField
        required
        type='password'
        label='Confirm password'
        name='password2'
        fullWidth
        value={form.password2}
        onChange={handleChange}
        error={errors.password2}
        helperText={errors.password2 || ' '}
      />
      <Button variant='contained' size='large' onClick={handleSubmit} sx={{ margin: '1.5rem' }}>
        Register
      </Button>
      <Typography variant='h6'>
        Already have an account?<Link to='/login'> Log in</Link>
      </Typography>
    </Container>
  );
}
