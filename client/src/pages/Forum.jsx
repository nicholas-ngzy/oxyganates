import React, { useState, useEffect, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import TokenContext from '../context/TokenProvider';
import { Card, CardHeader, CardContent, Avatar, Container, Fab, IconButton, Typography } from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import NavigateNextIcon from '@mui/icons-material/NavigateNext';
import PostDialog from '../components/PostDialog';

export default function Forum() {
  const [posts, setPosts] = useState([]);
  const [open, setOpen] = useState(false);
  const { token, user } = useContext(TokenContext);
  const navigate = useNavigate();

  useEffect(() => {
    axios
      .get(`${process.env.REACT_APP_API_URL}/posts`)
      .then((res) => setPosts(res.data))
      .catch((err) => console.log(err));
  }, []);

  const handleOpen = () => {
    if (!token) navigate('/login');
    else setOpen(true);
  };
  const handleClose = () => setOpen(false);

  return (
    <Container>
      <Typography variant='h4' py={3} textAlign='center'>
        Forum
      </Typography>
      {posts.map((post) => (
        <PostCard post={post} key={post._id} navigate={navigate} />
      ))}
      <Fab color='primary' sx={{ position: 'absolute', bottom: '10%', right: '5%' }} onClick={handleOpen}>
        <AddIcon />
      </Fab>
      <PostDialog open={open} handleClose={handleClose} userId={user.userId} />
    </Container>
  );
}

const convertDate = (date) => {
  let newDate = new Date(date);
  return newDate.toLocaleString('en-GB');
};

const PostCard = ({ post, navigate }) => (
  <Card variant='outlined' sx={{ margin: '1rem 0' }}>
    <CardHeader
      title={post.log[0].user.name}
      subheader={convertDate(post.log[0].date)}
      avatar={<Avatar children={post.log[0].user.name.charAt(0).toUpperCase()} />}
      action={<IconButton onClick={() => navigate(`/posts/${post._id}`)} children={<NavigateNextIcon />} />}
    />
    <CardContent>
      <Typography variant='h6'>{post.title}</Typography>
    </CardContent>
  </Card>
);
