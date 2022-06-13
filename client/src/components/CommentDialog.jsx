import { useState, useContext } from 'react';
import axios from 'axios';
import { Button, Dialog, DialogTitle, DialogContent, DialogActions, TextField } from '@mui/material';
import TokenContext from '../context/TokenProvider';
import { useNavigate } from 'react-router-dom';

export default function PostDialog({ open, handleClose, postId, comment, comments }) {
  const [form, setForm] = useState({ content: comment.content });
  const [errors, setErrors] = useState({});
  const { token } = useContext(TokenContext);
  const navigate = useNavigate();

  const handleChange = (event) => {
    const { name, value } = event.target;
    setForm({ ...form, [name]: value });
    setErrors({ ...errors, [name]: null });
  };

  const findError = () => {
    const { content } = form;
    const newErrors = {};
    if (!content || content === '') newErrors.content = 'Required field';
    return newErrors;
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    if (!token) navigate('/login');
    else {
      const newErrors = findError();
      if (Object.keys(newErrors).length > 0) setErrors(newErrors);
      try {
        for (let i = 0; i < comments.length; i++) {
          if (comments[i]._id === comment.commentId) {
            comments[i].content = form.content;
            break;
          }
        }
        axios
          .put(`${process.env.REACT_APP_API_URL}/posts/${postId}`, comments)
          .then((res) => window.location.reload())
          .catch((err) => console.log(err));
      } catch (err) {
        console.log(err);
      }
    }
  };

  return (
    <Dialog maxWidth='md' fullWidth open={open} onClose={handleClose}>
      <DialogTitle>Edit Comment</DialogTitle>
      <DialogContent>
        <TextField
          required
          label='Comment'
          name='content'
          fullWidth
          multiline
          margin='normal'
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
