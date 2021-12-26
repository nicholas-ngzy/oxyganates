import mongoose from 'mongoose';

const orderItemSchema = new mongoose.Schema({
  quantity: {
    type: Number,
    min: 1,
    required: true,
    default: 1,
  },
  order: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Order',
    required: true,
  },
  product: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Product',
    required: true,
  },
});

export const OrderItem = mongoose.model('OrderItem', orderItemSchema);
