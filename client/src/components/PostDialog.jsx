import { useState, useContext } from 'react';
import axios from 'axios';
import { Button, Dialog, DialogTitle, DialogContent, DialogActions, TextField } from '@mui/material';
import TokenContext from '../context/TokenProvider';
import { useNavigate } from 'react-router-dom';

export default function PostDialog({ open, handleClose, title, content, userId, postId }) {
  const [form, setForm] = useState({ title: title, content: content });
  const [errors, setErrors] = useState({});
  const { token, url } = useContext(TokenContext);
  const navigate = useNavigate();

  const handleChange = (event) => {
    const { name, value } = event.target;
    setForm({ ...form, user: userId, [name]: value });
    setErrors({ ...errors, [name]: null });
  };

  const findError = () => {
    const { title, content } = form;
    const newErrors = {};
    if (!title || title === '') newErrors.title = 'Required field';
    if (!content || content === '') newErrors.content = 'Required field';
    return newErrors;
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    if (!token) navigate('/login');
    else {
      const newErrors = findError();
      if (Object.keys(newErrors).length > 0) setErrors(newErrors);
      else {
        if (postId) {
          axios
            .put(`${url}/posts/${postId}`, form)
            .then((res) => window.location.reload())
            .catch((err) => console.log(err));
        } else {
          axios
            .post(`${url}/posts`, form)
            .then((res) => window.location.reload())
            .catch((err) => console.log(err));
        }
      }
    }
  };

  return (
    <Dialog maxWidth='md' fullWidth open={open} onClose={handleClose}>
      <DialogTitle>Edit post</DialogTitle>
      <DialogContent>
        <TextField
          required
          label='Post Title'
          name='title'
          margin='normal'
          fullWidth
          value={form.title}
          onChange={handleChange}
          error={Boolean(errors.title)}
          helperText={errors.title || ' '}
        />
        <TextField
          required
          label='Post Description'
          name='content'
          fullWidth
          multiline
          value={form.content}
          onChange={handleChange}
          error={Boolean(errors.content)}
          helperText={errors.content || ' '}
        />
      </DialogContent>
      <DialogActions>
        <Button onClick={handleClose}>Cancel</Button>
        <Button onClick={handleSubmit}>Submit</Button>
      </DialogActions>
    </Dialog>
  );
}
