import mongoose from 'mongoose';

const updateSchema = new mongoose.Schema(
  {
    campaignId: { type: mongoose.Schema.Types.ObjectId, ref: 'Campaign', required: true, index: true },
    authorId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    text: { type: String, required: true, minlength: 10 },
    imageUrl: { type: String },
  },
  { timestamps: true }
);

export default mongoose.model('Update', updateSchema);
