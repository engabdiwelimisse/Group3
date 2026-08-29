import mongoose from 'mongoose';

// In-app notifications only for now — meaningful events per Design_Rules.md
// Rule 38 (no notification noise): campaign approved/rejected, donation
// confirmed, withdrawal reviewed, beneficiary reviewed, team invite.
const notificationSchema = new mongoose.Schema(
  {
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true, index: true },
    type: { type: String, required: true },
    title: { type: String, required: true },
    body: { type: String },
    targetUrl: { type: String },
    read: { type: Boolean, default: false, index: true },
  },
  { timestamps: true }
);

export default mongoose.model('Notification', notificationSchema);
