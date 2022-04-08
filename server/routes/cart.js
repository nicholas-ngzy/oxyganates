// get and update cart items
import { Router } from 'express';
import mongoose from 'mongoose';
import { User } from '../models/user.js';
const router = Router();

//get cart by userid
router.get('/', async (req, res) => {
  const cart = await User.findById(req.query.user).select('cart').populate('cart.product', 'name price');
  if (cart) {
    res.status(200).send(cart);
  } else {
    res.status(500).send([{ message: 'Cart is empty' }]);
  }
});

//update cart with user id
router.patch('/', async (req, res) => {
  if (!mongoose.isValidObjectId(req.query.user)) {
    return res.status(404).send({ message: 'User id is invalid' });
  }
  let cartItem = await User.find({ _id: req.query.user, 'cart.product': req.body.product });
  if (cartItem.length > 0) {
    cartItem = await User.findByIdAndUpdate(req.query.user, {
      $pull: {
        cart: {
          product: req.body.product,
        },
      },
    });
  }
  cartItem = await User.findByIdAndUpdate(req.query.user, {
    $push: {
      cart: req.body,
    },
  });
  if (cartItem) {
    res.status(200).json({ message: 'Cart updated' });
  } else {
    res.status(500).json({ message: 'Cart not updated' });
  }
});

//clear cart
router.put('/', async (req, res) => {
  if (!mongoose.isValidObjectId(req.query.user)) {
    return res.status(404).send({ message: 'User id is invalid' });
  }
  const cartItem = await User.findByIdAndUpdate(req.query.user, { cart: [] });
  if (cartItem) {
    res.status(200).json({ message: 'Cart cleared' });
  } else {
    res.status(500).json({ message: 'Cart not cleared' });
  }
});
export default router;
