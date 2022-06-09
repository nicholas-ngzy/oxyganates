import { User } from '../models/user.js';
import { Router } from 'express';
const router = Router();
import bcrypt from 'bcrypt';
import jsonwebtoken from 'jsonwebtoken';

//register customer
router.post('/register', async (req, res) => {
  if (!req.body.email || !req.body.name) return res.status(500).send({ message: 'Fill in all field' });
  if (req.body.password1.length < 8) return res.status(500).send({ message: 'Password at least 8 characters' });
  if (req.body.password1 != req.body.password2) return res.status(500).send({ message: 'Password does not match' });
  const user = await User.findOne({ email: req.body.email });
  if (user) return res.status(403).send({ message: 'Email already exist' });
  else {
    const user = new User({
      name: req.body.name,
      email: req.body.email,
      passwordHash: bcrypt.hashSync(req.body.password1, 10),
    });
    user
      .save()
      .then(() => res.status(201).send({ message: 'Successful registration' }))
      .catch((err) => res.status(500).send({ message: 'Unsuccessful registration' }));
  }
});

//login
router.post('/login', async (req, res) => {
  //find email in database
  const user = await User.findOne({ email: req.body.email });
  const secret = process.env.SECRET;
  //email not found
  if (!user) return res.status(401).send({ message: 'Invalid credentials' });
  // email and password both correct
  if (user && bcrypt.compareSync(req.body.password, user.passwordHash)) {
    const token = jsonwebtoken.sign({ userId: user.id, name: user.name, isAdmin: user.isAdmin }, secret, {
      expiresIn: '12h',
    });
    return res.status(200).send({ token: token, message: 'Successful login', isAdmin: user.isAdmin });
  } else res.status(401).send({ message: 'Invalid credentials' });
});

export default router;
