import mongoose from 'mongoose';

const addressSchema = mongoose.Schema({
  street: {
    type: String,
    required: true,
    trim: true,
  },
  city: {
    type: String,
    required: true,
    trim: true,
  },
  zipcode: {
    type: String,
    required: true,
    trim: true,
    maxLength: [5],
  },
  state: {
    type: String,
    required: true,
    trim: true,
  },
  country: {
    type: String,
    required: true,
    trim: true,
  },
});

export const Address = mongoose.model('Address', addressSchema);
