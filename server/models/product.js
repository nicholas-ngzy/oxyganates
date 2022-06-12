import mongoose from 'mongoose';

const productSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  description: {
    type: String,
    required: true,
  },
  price: {
    type: Number,
    min: 0.01,
    required: true,
  },
  quantity: {
    type: Number,
    default: 0,
    min: 0,
    required: true,
  },
  image: {
    data: Buffer,
    contentType: String,
  },
  category: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Category',
    required: true,
  },
});
// productSchema.method.getPrice = () => {
//   return price.toFixed(2);
// };

productSchema.virtual('id').get(function () {
  return this._id.toHexString();
});

productSchema.set('toJSON', {
  virtuals: true,
});

export const Product = mongoose.model('Product', productSchema);
