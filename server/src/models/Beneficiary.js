import mongoose from 'mongoose';

const beneficiarySchema = new mongoose.Schema(
  {
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', index: true },
    fullName: { type: String, required: true },
    idDocumentUrl: { type: String },
    verificationStatus: {
      type: String,
      enum: ['pending', 'verified', 'rejected'],
      default: 'pending',
    },
    verifiedAt: { type: Date },
    verifiedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    payoutAccountId: { type: mongoose.Schema.Types.ObjectId, ref: 'PayoutAccount' },
  },
  { timestamps: true }
);

export default mongoose.model('Beneficiary', beneficiarySchema);
