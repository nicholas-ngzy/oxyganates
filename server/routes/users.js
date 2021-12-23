import { User } from '../models/user.js';
import { Router } from 'express';
import mongoose from 'mongoose';
const router = Router();
import bcrypt from 'bcrypt';

//update name and email
router.put('/:id', async (req, res) => {
  if (mongoose.isValidObjectId(req.params.id)) {
    const user = await User.findByIdAndUpdate(req.params.id, {
      name: req.body.name,
      email: req.body.email,
    });
    if (user) {
      res.status(200).json({ success: true, message: 'User updated' });
    } else {
      res.status(404).json({ success: false, message: 'User id not found' });
    }
  } else {
    res.status(400).json({ success: false, message: 'User id is invalid' });
  }
});

//update password
router.put('/:id/changepassword', async (req, res) => {
  if (mongoose.isValidObjectId(req.params.id)) {
    if (req.body.password1 != req.body.password2) {
      return res.status(500).json({ message: 'Password does not match' });
    }
    const user = await User.findByIdAndUpdate(req.params.id, {
      passwordHash: bcrypt.hashSync(req.body.password1, 10),
    });
    if (user) {
      res.status(200).json({ success: true, message: 'Password updated' });
    } else {
      res.status(404).json({ success: false, message: 'User id not found' });
    }
  } else {
    res.status(400).json({ success: false, message: 'User id is invalid' });
  }
});

//get all users
router.get('/', async (req, res) => {
  const userList = await User.find().select('-passwordHash');
  if (userList) {
    res.json(userList);
  } else {
    res.status(500).json({ success: false });
  }
});

//get a user
router.get('/:id', async (req, res) => {
  const user = await User.findById(req.params.id).select('-passwordHash');
  if (user) {
    res.status(200).json(user);
  } else {
    res.status(500).json({ success: false });
  }
});

// delete user
router.delete('/:id', (req, res) => {
  User.findByIdAndDelete(req.params.id)
    .then((user) => {
      if (user) {
        res.status(200).json({ success: true, message: 'User deleted' });
      } else {
        res.status(404).json({ success: false, message: 'User not found' });
      }
    })
    .catch((err) => {
      res.json({ success: false, error: err });
    });
});

export default router;
