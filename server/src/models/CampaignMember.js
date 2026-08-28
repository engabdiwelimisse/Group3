import mongoose from 'mongoose';

const campaignMemberSchema = new mongoose.Schema(
  {
    campaignId: { type: mongoose.Schema.Types.ObjectId, ref: 'Campaign', required: true, index: true },
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', index: true },
    inviteEmail: { type: String, required: true, lowercase: true, trim: true },
    role: { type: String, enum: ['co-organizer'], default: 'co-organizer' },
    status: { type: String, enum: ['pending', 'accepted'], default: 'pending', index: true },
    invitedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    invitedAt: { type: Date, default: Date.now },
    acceptedAt: { type: Date },
  },
  { timestamps: true }
);

campaignMemberSchema.index({ campaignId: 1, inviteEmail: 1 }, { unique: true });

export default mongoose.model('CampaignMember', campaignMemberSchema);
