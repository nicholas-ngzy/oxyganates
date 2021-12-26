import mongoose from 'mongoose';

const cartItemSchema = new mongoose.Schema({
  quantity: {
    type: Number,
    min: 1,
    required: true,
    default: 1,
  },
  cart: {
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

export const CartItem = mongoose.model('CartItem', cartItemSchema);
