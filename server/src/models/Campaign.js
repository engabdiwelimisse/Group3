import mongoose from 'mongoose';

const campaignSchema = new mongoose.Schema(
  {
    organizerId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true, index: true },
    beneficiaryId: { type: mongoose.Schema.Types.ObjectId, ref: 'Beneficiary' },
    title: {
      so: { type: String, required: true },
      en: { type: String },
    },
    story: {
      so: { type: String, required: true },
      en: { type: String },
    },
    category: {
      type: String,
      required: true,
      index: true,
      enum: [
        'Medical', 'Education', 'Emergency', 'Family', 'Funeral', 'Community',
        'Mosque', 'School', 'Orphan Support', 'Disaster Relief', 'Business/Startup',
        'NGO', 'Public Projects', 'Other',
      ],
    },
    subcategory: { type: String },
    tags: { type: [String], default: [] },
    goalAmount: { type: Number, required: true, min: 1 },
    raisedAmount: { type: Number, default: 0 },
    currency: { type: String, default: 'USD' },
    coverImageUrl: { type: String },
    mediaUrls: { type: [String], default: [] },
    status: {
      type: String,
      index: true,
      enum: [
        'draft', 'submitted', 'under_review', 'approved', 'published', 'active',
        'goal_reached', 'withdrawal', 'completed', 'rejected', 'suspended',
        'frozen', 'cancelled', 'expired',
      ],
      default: 'draft',
    },
    verificationBadges: { type: [String], default: [] },
    region: { type: String },
    endDate: { type: Date },
  },
  { timestamps: true }
);

campaignSchema.index({ 'title.so': 'text', 'title.en': 'text', 'story.so': 'text', 'story.en': 'text' });

export default mongoose.model('Campaign', campaignSchema);
