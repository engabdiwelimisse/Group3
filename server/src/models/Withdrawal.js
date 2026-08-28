import mongoose from 'mongoose';

const withdrawalSchema = new mongoose.Schema(
  {
    campaignId: { type: mongoose.Schema.Types.ObjectId, ref: 'Campaign', required: true, index: true },
    requestedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    amount: { type: Number, required: true, min: 1 },
    payoutAccountId: { type: mongoose.Schema.Types.ObjectId, ref: 'PayoutAccount', required: true },
    status: {
      type: String,
      enum: ['pending', 'under_review', 'approved', 'processing', 'completed', 'failed', 'frozen'],
      default: 'pending',
      index: true,
    },
    reviewedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    reviewedAt: { type: Date },
    reason: { type: String },
    providerTransactionId: { type: mongoose.Schema.Types.ObjectId, ref: 'PaymentTransaction' },
  },
  { timestamps: true }
);

export default mongoose.model('Withdrawal', withdrawalSchema);
