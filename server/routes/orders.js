import { Order } from '../models/order.js';
import { Router } from 'express';
import mongoose from 'mongoose';
const router = Router();

// create an order
router.post('/', (req, res) => {
  const order = new Order({
    user: req.body.user,
    items: req.body.items,
    total: req.body.total,
  });
  order
    .save()
    .then((createdOrder) => {
      return res.status(201).send(createdOrder);
    })
    .catch((err) => {
      return res.status(500).send({ message: err });
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
    return res.status(200).send({ orderList });
  } else {
    return res.status(500).send({ message: 'No order' });
  }
});

// get number of orders
router.get('/count', async (req, res) => {
  const orderCount = await Order.countDocuments({});
  if (orderCount) {
    return res.send({ orderCount: orderCount });
  } else {
    return res.status(500).json({ success: false });
  }
});

// get a order
router.get('/:id', async (req, res) => {
  const order = await Order.findById(req.params.id);
  if (order) {
    return res.status(200).send(order);
  } else {
    return res.status(500).send({ success: false });
  }
});

// update order
router.patch('/:id', async (req, res) => {
  if (!mongoose.isValidObjectId(req.params.id)) {
    return res.status(404).send({ message: 'Order id is invalid' });
  }
  const updatedOrder = await Order.findByIdAndUpdate(req.params.id, req.body);
  if (updatedOrder) {
    return res.status(200).json({ success: true, message: 'Order updated' });
  } else {
    return res.status(404).json({ success: false, message: 'Order id not found' });
  }
});

// delete order
router.delete('/:id', (req, res) => {
  Order.findByIdAndDelete(req.params.id)
    .then((order) => {
      if (order) {
        return res.status(200).json({ success: true, message: 'Order deleted' });
      } else {
        return res.status(404).json({ success: false, message: 'Order not found' });
      }
    })
    .catch((err) => {
      return res.json({ success: false, error: err });
    });
});
export default router;
