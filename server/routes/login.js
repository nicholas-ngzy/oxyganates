import { User } from '../models/user.js';
import { Router } from 'express';
const router = Router();
import bcrypt from 'bcrypt';
import jsonwebtoken from 'jsonwebtoken';

//register customer
router.post('/register', async (req, res) => {
  if (!req.body.email || !req.body.name || !req.body.phone) {
    return res.status(500).send({ message: 'Fill in all field' });
  }
  if (req.body.password1.length < 8) {
    return res.status(500).send({ message: 'Password at least 8 characters' });
  }
  if (req.body.password1 != req.body.password2) {
    return res.status(500).send({ message: 'Password does not match' });
  }
  if (req.body.phone.length < 10) {
    return res.status(500).send({ message: 'Phone number too short' });
  }
  const user = await User.findOne({ email: req.body.email });
  if (user) {
    return res.status(403).send({ message: 'Email already exist' });
  } else {
    const user = new User({
      name: req.body.name,
      email: req.body.email,
      passwordHash: bcrypt.hashSync(req.body.password1, 10),
      phone: req.body.phone,
    });
    user
      .save()
      .then(() => {
        return res.status(201).json({ message: 'Successful registration' });
      })
      .catch((err) => {
        return res.status(500).json({ message: 'Unsuccessful registration' });
      });
  }
});

//register admin
router.post('/register/admin', async (req, res) => {
  if (!req.body.email || !req.body.name || req.body.phone) {
    return res.status(400).json({ message: 'Fill in all field' });
  }
  if (req.body.password1.length < 8) {
    return res.status(400).json({ message: 'Password at least 8 characters' });
  }
  if (req.body.password1 != req.body.password2) {
    return res.status(400).json({ message: 'Password does not match' });
  }
  if (req.body.phone.length < 10) {
    return res.status(400).json({ message: 'Phone number too short' });
  }
  const user = await User.findOne({ email: req.body.email });
  if (user) {
    return res.status(403).send({ message: 'Email already exist' });
  } else {
    const user = new User({
      name: req.body.name,
      email: req.body.email,
      passwordHash: bcrypt.hashSync(req.body.password1, 10),
      isAdmin: true,
    });
    user
      .save()
      .then(() => {
        return res.status(201).json({ message: 'Successful registration' });
      })
      .catch((err) => {
        res.status(500).json({ message: 'Unsuccessful registration' });
      });
  }
});

//login
router.post('/login', async (req, res) => {
  //find email in database
  const user = await User.findOne({ email: req.body.email });
  const secret = process.env.SECRET;
  //email not found
  if (!user) {
    return res.status(404).send({ message: 'User not found' });
  }
  // email and password both correct
  if (user && bcrypt.compareSync(req.body.password, user.passwordHash)) {
    const token = jsonwebtoken.sign({ userId: user.id, isAdmin: user.isAdmin }, secret, { expiresIn: '1d' });
    return res.status(200).send({ user: user.email, token: token, message: 'Successful login' });
  } else {
    return res.status(400).send({ message: 'Wrong credentials' });
  }
});
export default router;
