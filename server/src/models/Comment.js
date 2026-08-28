import mongoose from 'mongoose';

const commentSchema = new mongoose.Schema(
  {
    campaignId: { type: mongoose.Schema.Types.ObjectId, ref: 'Campaign', required: true, index: true },
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    text: { type: String, required: true, minlength: 1, maxlength: 1000 },
  },
  { timestamps: true }
);

export default mongoose.model('Comment', commentSchema);
