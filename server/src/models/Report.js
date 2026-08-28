import mongoose from 'mongoose';

const reportSchema = new mongoose.Schema(
  {
    reporterId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true, index: true },
    targetType: { type: String, enum: ['campaign', 'user'], required: true },
    targetId: { type: mongoose.Schema.Types.ObjectId, required: true, index: true },
    reason: { type: String, required: true, minlength: 5, maxlength: 500 },
    status: { type: String, enum: ['open', 'reviewed', 'dismissed'], default: 'open', index: true },
    reviewedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    reviewNote: { type: String },
  },
  { timestamps: true }
);

export default mongoose.model('Report', reportSchema);
