import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import { Card, CardContent, CardHeader, Container, Typography } from '@mui/material';

export default function Post() {
  const [post, setPost] = useState({});
  const [comments, setComments] = useState([{}]);
  let { id } = useParams();

  useEffect(() => {
    axios
      .get(`http://localhost:6969/api/v1/posts/${id}`)
      .then((res) => {
        setPost(res.data);
      })
      .catch((err) => {
        console.log(err);
      });
  }, []);

  return (
    <Container>
      <Card>
        <CardHeader title={post.title} subheader={convertDate(post.date)} />
        <CardContent>
          <Typography>{post.content}</Typography>
        </CardContent>
      </Card>
      {/* {comments.map((comment) => {
        return <Card></Card>;
      })} */}
    </Container>
  );
}

const convertDate = (date) => {
  var newDate = new Date(date);
  return newDate.toLocaleString('en-GB');
};
