import mongoose from 'mongoose';

// Immutable ledger entry per provider event. Never update or delete a confirmed
// record — corrections happen via new reversal/adjustment records that reference
// the original transaction.
const paymentTransactionSchema = new mongoose.Schema(
  {
    paymentId: { type: mongoose.Schema.Types.ObjectId, ref: 'Payment', required: true, index: true },
    provider: { type: String, required: true }, // 'mobile_money' | 'bank' | 'card' | 'manual'
    providerTransactionId: { type: String, required: true, unique: true, index: true },
    amount: { type: Number, required: true },
    currency: { type: String, default: 'USD' },
    status: {
      type: String,
      enum: ['pending', 'confirmed', 'failed', 'reversed'],
      default: 'pending',
    },
    reversalOf: { type: mongoose.Schema.Types.ObjectId, ref: 'PaymentTransaction' },
    rawPayload: { type: mongoose.Schema.Types.Mixed },
  },
  { timestamps: { createdAt: true, updatedAt: false } }
);

export default mongoose.model('PaymentTransaction', paymentTransactionSchema);
