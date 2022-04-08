import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import axios from 'axios';
import '../App.css';
import Form from 'react-bootstrap/Form';
import FormGroup from 'react-bootstrap/esm/FormGroup';
import { Button, Typography } from '@mui/material';

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
    const { email, name, password1, password2, phone } = form;
    const newErrors = {};
    if (!email || email === '') newErrors.email = 'Required field';
    if (!name || name === '') newErrors.name = 'Required field';
    if (!password1 || password1 === '') newErrors.password1 = 'Required field';
    if (password1 != password2) newErrors.password2 = 'Does not match';
    if (!password2 || password2 === '') newErrors.password2 = 'Required field';
    if (!phone || phone === '') newErrors.phone = 'Required field';
    if (password1) {
      if (password1.length < 8) newErrors.password1 = 'Minimum 8 characters';
    }
    if (password2) {
      if (password2.length < 8) newErrors.password2 = 'Minimum 8 characters';
    }
    if (phone) {
      if (phone.length < 10) newErrors.phone = 'Invalid phone number';
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
        if (err.response.status == '403') alert('Email already exist');
      });
  };

  return (
    <div className='register-wrapper'>
      <Typography variant='h3' marginY={3}>
        Sign Up
      </Typography>
      <Typography variant='h5'>Please enter all details</Typography>
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

        <FormGroup size='lg' controlId='name' className='my-4'>
          <Form.Label>Name</Form.Label>
          <Form.Control name='name' type='text' value={form.name} onChange={handleChange} isInvalid={!!errors.name} />
          <Form.Control.Feedback type='invalid'>{errors.name}</Form.Control.Feedback>
        </FormGroup>

        <Form.Group size='lg' controlId='password1' className='my-4'>
          <Form.Label>Password</Form.Label>
          <Form.Control
            name='password1'
            type='password'
            value={form.password1}
            onChange={handleChange}
            isInvalid={!!errors.password1}
          />
          <Form.Control.Feedback type='invalid'>{errors.password1}</Form.Control.Feedback>
        </Form.Group>

        <Form.Group size='lg' controlId='password2' className='my-4'>
          <Form.Label>Confirm password</Form.Label>
          <Form.Control
            name='password2'
            type='password'
            value={form.password2}
            onChange={handleChange}
            isInvalid={!!errors.password2}
          />
          <Form.Control.Feedback type='invalid'>{errors.password2}</Form.Control.Feedback>
        </Form.Group>

        <Form.Group size='lg' controlId='phone' className='my-4'>
          <Form.Label>Phone</Form.Label>
          <Form.Control
            name='phone'
            type='text'
            value={form.phone}
            onChange={handleChange}
            isInvalid={!!errors.phone}
          />
          <Form.Control.Feedback type='invalid'>{errors.phone}</Form.Control.Feedback>
        </Form.Group>
        <Button variant='contained' onClick={handleSubmit}>
          Register
        </Button>
      </Form>
      <Typography variant='h6'>
        Already have an account?<Link to='/login'> Log in</Link>
      </Typography>
    </div>
  );
}
