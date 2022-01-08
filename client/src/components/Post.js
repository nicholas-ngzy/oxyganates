import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import NavMenu from './NavMenu';

const Post = () => {
  const [post, setPost] = useState({});
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
    <div>
      <NavMenu />
      <div className='border m-4' style={{ textAlign: 'left' }}>
        <h1 className='m-4'>{post.title}</h1>
        <h2 className='m-4'>{post.content}</h2>
        <h6 className='m-4'>{post.date}</h6>
      </div>
    </div>
  );
};

export default Post;
