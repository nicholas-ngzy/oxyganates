import { useState, useContext } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import axios from 'axios';
import { Button, Container, TextField, Typography } from '@mui/material';
import jwtDecode from 'jwt-decode';
import TokenContext from '../context/TokenProvider';

export default function Login() {
  const navigate = useNavigate();
  const [form, setForm] = useState({ email: '', password: '' });
  const [errors, setErrors] = useState({});
  const { setToken, setUser } = useContext(TokenContext);

  const handleChange = (event) => {
    const { name, value } = event.target;
    setForm({ ...form, [name]: value });
    setErrors({ ...errors, [name]: null });
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
    if (Object.keys(newErrors).length > 0) setErrors(newErrors);
    else {
      try {
        login();
      } catch (err) {
        console.log(err.message);
      }
    }
  };

  const login = () => {
    axios
      .post(`${process.env.REACT_APP_API_URL}/login`, form)
      .then((res) => {
        setUser(jwtDecode(res.data.token));
        setToken(res.data.token);
        sessionStorage.setItem('token', res.data.token);
        jwtDecode(res.data.token).isAdmin ? navigate('/admin') : navigate('/');
      })
      .catch((err) => {
        if (err.response.status === 401) alert('Invalid credentials');
        else alert(err);
      });
  };

  return (
    <Container sx={{ textAlign: 'center', width: '50%' }}>
      <Typography variant='h4' marginTop={4}>
        Log in
      </Typography>
      <Typography variant='h6' marginY={1}>
        Please enter email and password
      </Typography>
      <TextField
        autoFocus
        required
        label='Email'
        name='email'
        margin='normal'
        fullWidth
        value={form.email}
        onChange={handleChange}
        error={errors.email}
        helperText={errors.email || ' '}
      />
      <TextField
        required
        type='password'
        label='Password'
        name='password'
        margin='normal'
        fullWidth
        value={form.password}
        onChange={handleChange}
        error={errors.password}
        helperText={errors.password || ' '}
      />
      <Button variant='contained' size='large' onClick={handleSubmit} sx={{ margin: '1.5rem' }}>
        Login
      </Button>
      <Typography variant='h6'>
        Don't have an account? <Link to='/register'>Sign up</Link>
      </Typography>
    </Container>
  );
}
