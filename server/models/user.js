import mongoose from 'mongoose';

const userSchema = mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true,
  },
  passwordHash: {
    type: String,
    required: true,
    minLength: [8, 'password need at least 8 characters'],
  },
  email: {
    type: String,
    required: true,
    trim: true,
    lowercase: true,
    unique: true,
  },
  phone: {
    type: String,
    // required: true,
    trim: true,
    minLength: [10, 'phone number too short'],
  },
  isAdmin: {
    type: Boolean,
    default: false,
  },
  address: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Address',
  },
});

export const User = mongoose.model('User', userSchema);
