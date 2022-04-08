import { Order } from '../models/order.js';
import { Router } from 'express';
import mongoose from 'mongoose';
const router = Router();

//create a order
router.post('/', (req, res) => {
  const order = new Order({
    total: req.body.total,
    status: req.body.status,
    user: req.body.user,
    address: req.body.address,
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
  const orderList = await Order.find().populate('user');
  if (orderList) {
    res.status(200).send({ orderList });
  } else {
    res.status(500).send({ message: 'No orders' });
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
