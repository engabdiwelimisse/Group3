import mongoose from 'mongoose';

const verificationSchema = new mongoose.Schema(
  {
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', index: true },
    beneficiaryId: { type: mongoose.Schema.Types.ObjectId, ref: 'Beneficiary', index: true },
    type: {
      type: String,
      enum: ['email', 'phone', 'identity', 'beneficiary', 'payment', 'organization', 'organizer_request'],
      required: true,
    },
    status: { type: String, enum: ['pending', 'approved', 'rejected'], default: 'pending' },
    documentUrls: { type: [String], default: [] },
    reviewedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    token: { type: String }, // for email verification / password reset style tokens
    expiresAt: { type: Date },
  },
  { timestamps: true }
);

export default mongoose.model('Verification', verificationSchema);
