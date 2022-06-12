import { Order } from '../models/order.js';
import { Router } from 'express';
import mongoose from 'mongoose';
const router = Router();

// create an order
router.post('/', (req, res) => {
  const order = new Order({ user: req.body.user, items: req.body.items, total: req.body.total });
  order
    .save()
    .then((createdOrder) => res.status(201).send(createdOrder))
    .catch((err) => res.status(500).send(err));
});

// get all orders
router.get('/', async (req, res) => {
  let filter;
  if (req.query.user) filter = { user: req.query.user.split(',') };
  const orderList = await Order.find(filter)
    .populate('user', 'name')
    .populate('items.product', 'name price')
    .sort('-date')
    .exec();
  if (orderList) res.status(200).send(orderList);
  else res.status(500).send('No order');
});

// get earnings by day
router.get('/sales', async (req, res) => {
  const order = await Order.aggregate([
    { $match: { date: { $gte: new Date('2022-01-01'), $lt: new Date('2023-01-01') } } },
    {
      $group: {
        _id: { $dateToString: { format: '%Y-%m-%d', date: '$date' } },
        totalSaleAmount: { $sum: '$total' },
        count: { $sum: 1 },
      },
    },
    { $sort: { _id: 1 } },
  ]);
  if (order) res.status(200).send(order);
  else res.status(500).send('Error');
});

// get earnings by day
router.get('/status', async (req, res) => {
  const order = await Order.aggregate([
    { $project: { date: { $dateToString: { format: '%Y-%m-%d', date: '$date' } }, status: 1 } },
    { $group: { _id: { date: '$date', statusName: '$status' }, count: { $sum: 1 } } },
    {
      $group: {
        _id: '$_id.date',
        value: { $sum: '$count' },
        statuses: { $push: { name: '$_id.statusName', val: '$count' } },
      },
    },
    {
      $project: {
        content: { $arrayToObject: { $map: { input: '$statuses', as: 'el', in: { k: '$$el.name', v: '$$el.val' } } } },
        value: 1,
      },
    },
    {
      $project: {
        _id: 1,
        value: 1,
        Completed: { $ifNull: ['$content.Completed', 0] },
        Cancelled: { $ifNull: ['$content.Cancelled', 0] },
        Processing: { $ifNull: ['$content.Processing', 0] },
      },
    },
    { $sort: { _id: 1 } },
  ]);
  if (order) res.status(200).send(order);
  else res.status(500).send('Error');
});

// get a order
router.get('/:id', async (req, res) => {
  const order = await Order.findById(req.params.id);
  if (order) res.status(200).send(order);
  else res.status(500).send('Order not found');
});

// update order
router.patch('/:id', async (req, res) => {
  if (!mongoose.isValidObjectId(req.params.id)) return res.status(404).send('Order id is invalid');
  const updatedOrder = await Order.findByIdAndUpdate(req.params.id, req.body);
  if (updatedOrder) res.status(200).send('Order updated');
  else res.status(404).send('Order not found');
});

// delete order
router.delete('/:id', (req, res) => {
  Order.findByIdAndDelete(req.params.id)
    .then((order) => {
      if (order) res.status(200).send('Order deleted');
      else res.status(404).send('Order not found');
    })
    .catch((err) => res.send(err));
});

export default router;
