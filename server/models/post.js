import mongoose from 'mongoose';

const postSchema = new mongoose.Schema({
  title: { type: String, required: true },
  content: { type: String, required: true },
  log: [
    {
      date: { type: Date, default: Date.now },
      user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    },
  ],
  comment: [
    {
      content: { type: String, required: true },
      date: { type: Date, default: Date.now },
      user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    },
  ],
  likeCount: { type: Number, required: true, default: 0 },
});

postSchema.virtual('id').get(function () {
  return this._id.toHexString();
});

postSchema.set('toJSON', {
  virtuals: true,
});

export const Post = mongoose.model('Post', postSchema);
