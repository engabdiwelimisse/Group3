import mongoose from 'mongoose';

// High-level payment intent. The core donation/withdrawal flow talks only to
// PaymentService, which creates and updates this record; provider adapters
// append PaymentTransaction ledger entries.
const paymentSchema = new mongoose.Schema(
  {
    campaignId: { type: mongoose.Schema.Types.ObjectId, ref: 'Campaign', index: true },
    donorId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', sparse: true },
    amount: { type: Number, required: true },
    currency: { type: String, default: 'USD' },
    provider: { type: String, required: true },
    status: {
      type: String,
      enum: ['created', 'pending', 'confirmed', 'failed', 'refunded'],
      default: 'created',
    },
  },
  { timestamps: true }
);

export default mongoose.model('Payment', paymentSchema);
