import { Order } from '../models/order.js';
import { Router } from 'express';
import mongoose from 'mongoose';
const router = Router();

//create a order
router.post('/', (req, res) => {
  const order = new Order({
    user: req.body.user,
    items: req.body.items,
    total: req.body.total,
  });
  order
    .save()
    .then((createdOrder) => {
      res.status(201).send(createdOrder);
    })
    .catch((err) => {
      res.status(500).send({ message: err });
    });
});

// get all orders
router.get('/', async (req, res) => {
  let filter = {};
  if (req.query.user) {
    filter = { user: req.query.user.split(',') };
  }
  const orderList = await Order.find(filter).populate('user', 'name').populate('items.product', 'name price').exec();
  if (orderList) {
    res.status(200).send({ orderList });
  } else {
    res.status(500).send({ message: 'No order' });
  }
});

//get number of orders
router.get('/count', async (req, res) => {
  const orderCount = await Order.countDocuments({});
  if (orderCount) {
    return res.send({ orderCount: orderCount });
  } else {
    return res.status(500).json({ success: false });
  }
});

//get a order
router.get('/:id', async (req, res) => {
  const order = await Order.findById(req.params.id);
  if (order) {
    res.status(200).send(order);
  } else {
    res.status(500).send({ success: false });
  }
});

export default router;
