import { Post } from '../models/post.js';
import { Router } from 'express';
import mongoose from 'mongoose';
const router = Router();

//create a post
router.post('/', (req, res) => {
  const post = new Post({
    title: req.body.title,
    content: req.body.content,
    user: req.body.user,
  });
  post
    .save()
    .then((createdPost) => {
      res.status(201).send(createdPost);
    })
    .catch((err) => {
      res.status(500).send({ message: err });
    });
});

// get all posts
router.get('/', async (req, res) => {
  const postList = await Post.find().populate('user', 'name');
  if (postList) {
    res.status(200).send({ postList });
  } else {
    res.status(500).send({ message: 'No posts' });
  }
});

//get a post
router.get('/:id', async (req, res) => {
  const post = await Post.findById(req.params.id).populate('user', 'name');
  if (post) {
    res.status(200).send(post);
  } else {
    res.status(500).send({ success: false });
  }
});

export default router;
