import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Box, Button, Container, Fab, Modal, Stack, TextField, Typography } from '@mui/material';
import ForumCard from '../components/ForumCard';
import AddIcon from '@mui/icons-material/Add';
import jwt_decode from 'jwt-decode';

export default function Forum() {
  const [posts, setPosts] = useState([]);
  const [open, setOpen] = useState(false);
  const token = useState(localStorage.getItem('token'));
  const config = { headers: { Authorization: `Bearer ${token}`, 'Content-Type': 'application/json' } };
  const [form, setForm] = useState({});
  const [errors, setErrors] = useState({});

  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);
  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm({
      ...form,
      [name]: value,
    });
    setErrors({
      ...errors,
      [name]: null,
    });
  };

  const findError = () => {
    const { title } = form;
    const newErrors = {};
    if (!title || title === '') newErrors.title = 'Required field';
    return newErrors;
  };

  const handleSubmit = () => {
    if (token === null) {
    }
    form.user = jwt_decode(token).user;
    const json = JSON.stringify(form);
    console.log(form);
    console.log(json);
    const newErrors = findError();
    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
    } else {
      try {
        axios
          .post(`http://localhost:6969/api/v1/posts`, json, config)
          .then((res) => {
            console.log('Success');
            // alert(res.data.message);
            window.location.reload();
          })
          .catch((err) => {
            console.log(err);
          });
      } catch (e) {
        console.log(e.message);
      }
    }
  };

  useEffect(() => {
    axios
      .get(`http://localhost:6969/api/v1/posts`)
      .then((res) => {
        setPosts(res.data.postList);
        console.log(res.data.postList);
      })
      .catch((err) => console.log(err));
  }, []);

  return (
    <Container>
      <Typography variant='h3' my={3} textAlign='center'>
        Forum
      </Typography>
      <Stack>
        {posts.map((post) => {
          return <ForumCard post={post} key={post._id} />;
        })}
      </Stack>
      <Fab color='primary' sx={{ position: 'absolute', bottom: '10%', right: '5%' }} onClick={handleOpen}>
        <AddIcon />
      </Fab>
      <Modal open={open} onClose={handleClose}>
        <Box
          sx={{
            position: 'absolute',
            top: '50%',
            left: '50%',
            transform: 'translate(-50%, -50%)',
            width: 800,
            bgcolor: 'background.paper',
            border: '2px solid #000',
            boxShadow: 24,
            p: 4,
          }}
        >
          <Typography variant='h4'>Create new post</Typography>
          <TextField
            required
            fullWidth
            id='outlined-required'
            label='Post Title'
            margin='normal'
            value={form.title}
            onChange={handleChange}
          />
          <TextField
            fullWidth
            id='outlined-multiline-flexible'
            label='Post Description'
            multiline
            rows={5}
            margin='dense'
            value={form.content}
            onChange={handleChange}
          />
          <Box textAlign='center'>
            <Button variant='contained' color='error' onClick={handleClose} sx={{ margin: ' 1em' }}>
              Cancel
            </Button>
            <Button variant='contained' color='success' onClick={handleSubmit} sx={{ margin: ' 1em' }}>
              Create
            </Button>
          </Box>
        </Box>
      </Modal>
    </Container>
  );
}
