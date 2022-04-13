import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import axios from 'axios';
import { Button, Container, TextField, Typography } from '@mui/material';

export default function Register() {
  const navigate = useNavigate();
  const [form, setForm] = useState({});
  const [errors, setErrors] = useState({});

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm({
      ...form,
      [name]: value,
    });
    // clear error
    setErrors({
      ...errors,
      [name]: null,
    });
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
    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
    } else {
      try {
        register();
      } catch (e) {
        console.log(e.message);
      }
    }
  };

  const register = () => {
    axios
      .post('http://localhost:6969/api/v1/register', form)
      .then((res) => {
        alert(res.data.message);
        navigate('/login');
      })
      .catch((err) => {
        if (err.response.status === 403) alert('Email already exist');
      });
  };

  return (
    <Container sx={{ textAlign: 'center', width: '50%' }}>
      <Typography variant='h3' marginTop={5}>
        Sign Up
      </Typography>
      <Typography variant='h5' marginY={3}>
        Please enter all details
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
        id='standard-required'
        label='Name'
        name='name'
        margin='normal'
        fullWidth
        inputProps={{ style: { fontSize: 24 } }}
        inputLabelProps={{ style: { fontSize: 24 } }}
        value={form.name}
        onChange={handleChange}
        error={errors.name}
        helperText={errors.name || ' '}
      ></TextField>
      <TextField
        required
        id='standard-password-input'
        type='password'
        label='Password'
        name='password1'
        margin='normal'
        fullWidth
        inputProps={{ style: { fontSize: 24 } }}
        inputLabelProps={{ style: { fontSize: 24 } }}
        value={form.password1}
        onChange={handleChange}
        error={errors.password1}
        helperText={errors.password1 || ' '}
      ></TextField>
      <TextField
        required
        id='standard-password-input'
        type='password'
        label='Confirm password'
        name='password2'
        margin='normal'
        fullWidth
        inputProps={{ style: { fontSize: 24 } }}
        inputLabelProps={{ style: { fontSize: 24 } }}
        value={form.password2}
        onChange={handleChange}
        error={errors.password2}
        helperText={errors.password2 || ' '}
      ></TextField>
      <Button variant='contained' size='large' onClick={handleSubmit} sx={{ margin: '1.5rem' }}>
        Register
      </Button>
      <Typography variant='h6'>
        Already have an account?<Link to='/login'> Log in</Link>
      </Typography>
    </Container>
  );
}
