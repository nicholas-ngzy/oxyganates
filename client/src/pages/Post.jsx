import { useState, useEffect, useContext } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import {
  Avatar,
  Card,
  CardContent,
  CardHeader,
  Container,
  IconButton,
  InputAdornment,
  TextField,
  Typography,
} from '@mui/material';
import SendIcon from '@mui/icons-material/Send';
import TokenContext from '../context/TokenProvider';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import PostDialog from '../components/PostDialog';
import CommentDialog from '../components/CommentDialog';

export default function Post() {
  const [post, setPost] = useState({});
  const [comments, setComments] = useState([]);
  const [form, setForm] = useState({ content: '' });
  let { id } = useParams();
  const navigate = useNavigate();
  const { token, user } = useContext(TokenContext);

  useEffect(() => {
    axios
      .get(`${process.env.REACT_APP_API_URL}/posts/${id}`)
      .then((res) => {
        setPost(res.data);
        setComments(res.data.comment);
      })
      .catch((err) => console.log(err));
  }, [id]);

  // for editPost
  const [openPostDialog, setOpenPostDialog] = useState(false);
  const handleOpen = () => setOpenPostDialog(true);
  const handleClose = () => setOpenPostDialog(false);

  const handleDeletePost = () => {
    axios
      .delete(`${process.env.REACT_APP_API_URL}/posts/${id}`)
      .then(() => navigate('/posts'))
      .catch((err) => console.log(err));
  };

  const handleAddComment = () => {
    if (!token) navigate('/login');
    else if (form.content.trim() === '') alert('Empty comment');
    else {
      axios
        .patch(`${process.env.REACT_APP_API_URL}/posts/${id}`, form)
        .then((res) => {
          alert(res.data.message);
          window.location.reload();
        })
        .catch((err) => console.log(err));
    }
  };

  const handleDeleteComment = (commentId) => {
    for (let i = 0; i < comments.length; i++) {
      if (comments[i]._id === commentId) {
        comments.splice(i, 1);
        break;
      }
    }
    axios
      .put(`${process.env.REACT_APP_API_URL}/posts/${id}`, comments)
      .then((res) => window.location.reload())
      .catch((err) => console.log(err));
  };

  const [comment, setComment] = useState({ commentId: '', content: '' });
  const [openCommentDialog, setOpenCommentDialog] = useState(false);
  const handleCloseCommentDialog = () => setOpenCommentDialog(false);

  return (
    <Container>
      {openPostDialog && (
        <PostDialog
          open={openPostDialog}
          handleClose={handleClose}
          title={post.title}
          content={post.content}
          userId={user.userId}
          postId={id}
        />
      )}
      {openCommentDialog && (
        <CommentDialog
          open={openCommentDialog}
          handleClose={handleCloseCommentDialog}
          comment={comment}
          postId={id}
          comments={comments}
        />
      )}
      {post.log && (
        <Card variant='outlined' sx={{ margin: '1rem 0' }}>
          <CardHeader
            title={post.log[0].user.name}
            subheader={convertDate(post.log[0].date)}
            avatar={<Avatar children={post.log[0].user.name.charAt(0).toUpperCase()} />}
            action={
              (user.isAdmin || user.userId === post.log[0].user.id) && (
                <>
                  <IconButton onClick={handleOpen} children={<EditIcon />} />
                  <IconButton onClick={handleDeletePost} children={<DeleteIcon />} />
                </>
              )
            }
          />
          <CardContent>
            <Typography gutterBottom variant='h5'>
              {post.title}
            </Typography>
            <Typography variant='body1'>{post.content}</Typography>
          </CardContent>
        </Card>
      )}
      {comments.map((comment) => {
        return (
          <Comment
            comment={comment}
            user={user}
            setComment={setComment}
            setOpenCommentDialog={setOpenCommentDialog}
            handleDeleteComment={handleDeleteComment}
            key={comment._id}
          />
        );
      })}
      <TextField
        fullWidth
        multiline
        name='comment'
        value={form.comment}
        onChange={(event) => setForm({ content: event.target.value, user: user.userId })}
        variant='filled'
        placeholder='Type comment...'
        maxRows='5'
        InputProps={{
          endAdornment: (
            <InputAdornment position='end'>
              <IconButton onClick={handleAddComment}>
                <SendIcon color='primary' />
              </IconButton>
            </InputAdornment>
          ),
        }}
      />
    </Container>
  );
}

const convertDate = (date) => {
  let newDate = new Date(date);
  let options = {
    year: 'numeric',
    month: 'numeric',
    day: 'numeric',
    hour: 'numeric',
    minute: 'numeric',
    hour12: 'false',
  };
  return newDate.toLocaleString('en-GB', options);
};

const Comment = ({ comment, user, setComment, setOpenCommentDialog, handleDeleteComment }) => (
  <Card variant='outlined' key={comment._id} sx={{ margin: '1rem 0' }}>
    <CardHeader
      title={comment.user.name}
      subheader={convertDate(comment.date)}
      avatar={<Avatar children={comment.user.name.charAt(0).toUpperCase()} />}
      action={
        user.isAdmin || user.userId === comment.user.id ? (
          <>
            <IconButton
              onClick={() => {
                setComment({ commentId: comment._id, content: comment.content });
                setOpenCommentDialog(true);
              }}
            >
              <EditIcon />
            </IconButton>
            <IconButton onClick={() => handleDeleteComment(comment._id)}>
              <DeleteIcon />
            </IconButton>
          </>
        ) : (
          ''
        )
      }
    />
    <CardContent>
      <Typography variant='body1'>{comment.content}</Typography>
    </CardContent>
  </Card>
);
