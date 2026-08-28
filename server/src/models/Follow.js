import mongoose from 'mongoose';

const followSchema = new mongoose.Schema(
  {
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true, index: true },
    campaignId: { type: mongoose.Schema.Types.ObjectId, ref: 'Campaign', required: true, index: true },
  },
  { timestamps: true }
);

followSchema.index({ userId: 1, campaignId: 1 }, { unique: true });

export default mongoose.model('Follow', followSchema);
