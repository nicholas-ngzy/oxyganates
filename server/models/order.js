import mongoose from 'mongoose';

const orderSchema = new mongoose.Schema({
  date: {
    type: Date,
    default: Date.now,
  },
  total: {
    type: Number,
    min: 0.01,
    required: true,
    default: 0,
  },
  status: {
    type: String,
    default: Processing,
  },
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  address: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Address',
    required: true,
  },
});

export const Order = mongoose.model('Order', orderSchema);
