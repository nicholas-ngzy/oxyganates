import { User } from '../models/user.js';
import { Router } from 'express';
import mongoose from 'mongoose';
import bcrypt from 'bcrypt';
const router = Router();

//register admin
router.post('/', async (req, res) => {
  if (!req.body.email || !req.body.name) return res.status(400).send({ message: 'Fill in all field' });
  if (req.body.password.length < 8) return res.status(400).send({ message: 'Password at least 8 characters' });
  const user = await User.findOne({ email: req.body.email });
  if (user) return res.status(403).send({ message: 'Email already exist' });
  else {
    const user = new User({
      name: req.body.name,
      email: req.body.email,
      passwordHash: bcrypt.hashSync(req.body.password, 10),
      isAdmin: true,
    });
    user
      .save()
      .then((createdAdmin) => res.status(201).send(createdAdmin))
      .catch((err) => res.status(500).send(err));
  }
});

//get all users
router.get('/', async (req, res) => {
  const userList = await User.find().select('-passwordHash');
  if (userList) res.status(200).send(userList);
  else res.status(500).send({ message: 'Error' });
});

//get a user
router.get('/:id', async (req, res) => {
  const user = await User.findById(req.params.id).select('-passwordHash');
  if (user) res.status(200).send(user);
  else res.status(500).send({ message: 'Error' });
});

//update user
router.put('/:id', async (req, res) => {
  if (!mongoose.isValidObjectId(req.params.id)) return res.status(400).send({ message: 'User id is invalid' });
  const user = await User.findByIdAndUpdate(
    req.params.id,
    { name: req.body.name, email: req.body.email, phone: req.body.phone },
    { new: true }
  );
  if (user) res.status(200).send(user);
  else res.status(404).send({ message: 'User id not found' });
});

//update password
router.put('/:id/changepassword', async (req, res) => {
  if (!mongoose.isValidObjectId(req.params.id)) return res.status(400).send({ message: 'User id is invalid' });
  if (req.body.password1 != req.body.password2) return res.status(500).send({ message: 'Password does not match' });
  const user = await User.findByIdAndUpdate(req.params.id, { passwordHash: bcrypt.hashSync(req.body.password1, 10) });
  if (user) res.status(200).send(user);
  else res.status(404).send({ message: 'User id not found' });
});

// delete user
router.delete('/:id', (req, res) => {
  User.findByIdAndDelete(req.params.id)
    .then((user) => {
      if (user) res.status(200).send(user);
      else res.status(404).send({ message: 'User not found' });
    })
    .catch((err) => res.send(err));
});

export default router;
