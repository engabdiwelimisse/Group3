import mongoose from 'mongoose';

const payoutAccountSchema = new mongoose.Schema(
  {
    ownerId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true, index: true },
    type: { type: String, enum: ['mobile_money', 'bank'], required: true },
    accountNumberMasked: { type: String, required: true },
    providerName: { type: String, required: true },
    verified: { type: Boolean, default: false },
  },
  { timestamps: true }
);

export default mongoose.model('PayoutAccount', payoutAccountSchema);
