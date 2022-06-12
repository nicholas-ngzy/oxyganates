import { Post } from '../models/post.js';
import { Router } from 'express';
import mongoose from 'mongoose';
const router = Router();

//create a post
router.post('/', (req, res) => {
  const post = new Post({ title: req.body.title, content: req.body.content, log: [{ user: req.body.user }] });
  post
    .save()
    .then((createdPost) => res.status(201).send(createdPost))
    .catch((err) => res.status(500).send({ message: err }));
});

// get all posts
router.get('/', async (req, res) => {
  const query = [{ path: 'log.user', select: 'name' }];
  const postList = await Post.find().populate(query).sort('-log.date');
  if (postList) res.status(200).send(postList);
  else res.status(500).send({ message: 'No post' });
});

// get post
router.get('/:id', async (req, res) => {
  const query = [
    { path: 'log.user', select: 'name' },
    { path: 'comment.user', select: 'name' },
  ];
  const post = await Post.findById(req.params.id, { log: { $slice: -1 } }).populate(query);
  if (post) res.status(200).send(post);
  else res.status(500).send({ message: 'No post' });
});

//add comment
router.patch('/:id', async (req, res) => {
  if (!mongoose.isValidObjectId(req.params.id)) return res.status(404).send({ message: 'Post id is invalid' });
  const query = req.params.id;
  const update = { $push: { comment: req.body } };
  let post = await Post.findByIdAndUpdate(query, update);
  if (post) res.status(200).send({ message: 'Comment added' });
  else res.status(500).send({ message: 'Comment not added' });
});

router.put('/:id', async (req, res) => {
  if (!mongoose.isValidObjectId(req.params.id)) return res.status(404).send({ message: 'Post id is invalid' });
  const query = req.params.id;
  let update;
  // update post
  if (req.body.title || req.body.content)
    update = {
      title: req.body.title,
      content: req.body.content,
      $push: { log: { user: req.body.user } },
    };
  else update = { comment: req.body }; // delete comment by passing new array of comments
  let post = await Post.findByIdAndUpdate(query, update);
  if (post) res.status(200).send({ message: 'Comment added' });
  else res.status(500).send({ message: 'Comment not added' });
});

//delete post
router.delete('/:id', (req, res) => {
  Post.findByIdAndDelete(req.params.id)
    .then((post) => {
      if (post) res.status(200).send('Post deleted');
      else return res.status(404).send('Post not found');
    })
    .catch((err) => res.send(err));
});

export default router;
