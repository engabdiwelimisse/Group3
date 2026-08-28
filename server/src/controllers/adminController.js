import Payment from '../models/Payment.js';
import Donation from '../models/Donation.js';
import Campaign from '../models/Campaign.js';
import Beneficiary from '../models/Beneficiary.js';
import User from '../models/User.js';
import AuditLog from '../models/AuditLog.js';
import { asyncHandler } from '../utils/asyncHandler.js';
import { ApiError } from '../utils/ApiError.js';
import { PaymentService } from '../integrations/payments/PaymentService.js';
import { adminReviewCampaign, recomputeRaisedAmount } from '../services/campaignService.js';
import { toPublicUser } from '../services/authService.js';
import { logAudit } from '../services/auditLogService.js';
import { notifyUser } from '../services/notificationService.js';

// Unlike the public listing, admins can see campaigns in any status
// (draft, under_review, suspended, etc.) so review queues have full visibility.
export const listAllCampaigns = asyncHandler(async (req, res) => {
  const { status, page = 1, limit = 20 } = req.query;
  const filter = {};
  if (status) filter.status = status;

  const skip = (Number(page) - 1) * Number(limit);
  const [items, total] = await Promise.all([
    Campaign.find(filter).sort({ createdAt: -1 }).skip(skip).limit(Number(limit)),
    Campaign.countDocuments(filter),
  ]);

  res.json({ items, total, page: Number(page), limit: Number(limit) });
});

// Admin-recorded confirmation for the 'manual' provider — the MVP fallback
// until a real mobile-money/card/bank provider is integrated (spec Section 14).
export const confirmManualPayment = asyncHandler(async (req, res) => {
  const { paymentId } = req.params;
  const { providerTransactionId } = req.body;

  const payment = await Payment.findById(paymentId);
  if (!payment) throw new ApiError(404, 'NOT_FOUND', 'Payment not found');
  if (payment.provider !== 'manual') {
    throw new ApiError(400, 'INVALID_PROVIDER', 'Only manual payments can be confirmed through this endpoint');
  }
  if (payment.status === 'confirmed') {
    throw new ApiError(409, 'ALREADY_CONFIRMED', 'This payment has already been confirmed');
  }

  const donation = await Donation.findOne({ paymentId: payment._id });
  if (!donation) throw new ApiError(404, 'NOT_FOUND', 'No donation is linked to this payment');

  const { transaction } = await PaymentService.confirmPayment('manual', {
    paymentId: payment._id,
    providerTransactionId,
    adminId: req.user.id,
  });

  donation.status = 'confirmed';
  donation.paymentTransactionId = transaction._id;
  await donation.save();

  const raisedAmount = await recomputeRaisedAmount(donation.campaignId);

  await logAudit({
    actorId: req.user.id,
    action: 'payment.confirmed',
    targetType: 'Donation',
    targetId: donation._id,
    metadata: { amount: donation.amount, campaignId: donation.campaignId },
  });

  if (donation.donorId) {
    await notifyUser({
      userId: donation.donorId,
      type: 'donation_confirmed',
      title: 'Donation confirmed',
      body: `Your donation of $${donation.amount} has been confirmed. Thank you for your support.`,
      targetUrl: `/campaigns/${donation.campaignId}`,
    });
  }

  res.json({ donation, raisedAmount });
});

const CAMPAIGN_ACTION_MESSAGES = {
  approve: { title: 'Campaign approved', body: (c) => `"${campaignTitle(c)}" has been approved and is ready to publish.` },
  reject: { title: 'Campaign rejected', body: (c, reason) => `"${campaignTitle(c)}" was rejected. Reason: ${reason}` },
  publish: { title: 'Campaign published', body: (c) => `"${campaignTitle(c)}" is now live and visible to donors.` },
  suspend: { title: 'Campaign suspended', body: (c, reason) => `"${campaignTitle(c)}" was suspended. Reason: ${reason}` },
  restore: { title: 'Campaign restored', body: (c) => `"${campaignTitle(c)}" is active again.` },
};

function campaignTitle(campaign) {
  return campaign.title?.en || campaign.title?.so || 'Your campaign';
}

export const reviewCampaign = asyncHandler(async (req, res) => {
  const { action, reason } = req.body;
  const campaign = await adminReviewCampaign(req.params.id, action, reason);

  await logAudit({
    actorId: req.user.id,
    action: `campaign.${action}`,
    targetType: 'Campaign',
    targetId: campaign._id,
    metadata: { title: campaignTitle(campaign), reason },
  });

  const messages = CAMPAIGN_ACTION_MESSAGES[action];
  if (messages) {
    await notifyUser({
      userId: campaign.organizerId,
      type: `campaign_${action}`,
      title: messages.title,
      body: messages.body(campaign, reason),
      targetUrl: '/organizer',
    });
  }

  res.json(campaign);
});

export const listBeneficiaries = asyncHandler(async (req, res) => {
  const { status } = req.query;
  const filter = {};
  if (status) filter.verificationStatus = status;
  const beneficiaries = await Beneficiary.find(filter).sort({ createdAt: -1 }).populate('userId', 'fullName email');
  res.json(beneficiaries);
});

export const reviewBeneficiary = asyncHandler(async (req, res) => {
  const { status } = req.body; // 'verified' | 'rejected'
  const beneficiary = await Beneficiary.findById(req.params.id);
  if (!beneficiary) throw new ApiError(404, 'NOT_FOUND', 'Beneficiary not found');

  beneficiary.verificationStatus = status;
  beneficiary.verifiedBy = req.user.id;
  beneficiary.verifiedAt = status === 'verified' ? new Date() : undefined;
  await beneficiary.save();

  // Verification badges must reflect real checks, never be decorative (spec
  // Design_Rules.md Rule 18) — propagate to every campaign this beneficiary
  // is attached to as soon as they're verified or un-verified.
  if (status === 'verified') {
    await Campaign.updateMany(
      { beneficiaryId: beneficiary._id },
      { $addToSet: { verificationBadges: 'beneficiary_verified' } }
    );
  } else {
    await Campaign.updateMany(
      { beneficiaryId: beneficiary._id },
      { $pull: { verificationBadges: 'beneficiary_verified' } }
    );
  }

  await logAudit({
    actorId: req.user.id,
    action: `beneficiary.${status}`,
    targetType: 'Beneficiary',
    targetId: beneficiary._id,
    metadata: { fullName: beneficiary.fullName },
  });

  if (beneficiary.userId) {
    await notifyUser({
      userId: beneficiary.userId,
      type: `beneficiary_${status}`,
      title: status === 'verified' ? 'Beneficiary verified' : 'Beneficiary verification rejected',
      body:
        status === 'verified'
          ? `${beneficiary.fullName} has been verified. Linked campaigns now show the Beneficiary Verified badge.`
          : `The verification for ${beneficiary.fullName} was not approved. Please review and resubmit.`,
      targetUrl: '/verification',
    });
  }

  res.json(beneficiary);
});

export const listUsers = asyncHandler(async (req, res) => {
  const { q, role, page = 1, limit = 20 } = req.query;
  const filter = {};
  if (role) filter.roles = role;
  if (q) filter.$or = [{ fullName: { $regex: q, $options: 'i' } }, { email: { $regex: q, $options: 'i' } }];

  const skip = (Number(page) - 1) * Number(limit);
  const [items, total] = await Promise.all([
    User.find(filter).sort({ createdAt: -1 }).skip(skip).limit(Number(limit)),
    User.countDocuments(filter),
  ]);

  res.json({ items: items.map(toPublicUser), total, page: Number(page), limit: Number(limit) });
});

export const updateUserStatus = asyncHandler(async (req, res) => {
  const { status } = req.body; // 'active' | 'suspended' | 'banned'
  const user = await User.findByIdAndUpdate(req.params.id, { status }, { new: true });
  if (!user) throw new ApiError(404, 'NOT_FOUND', 'User not found');

  await logAudit({
    actorId: req.user.id,
    action: `user.${status}`,
    targetType: 'User',
    targetId: user._id,
    metadata: { email: user.email },
  });

  if (status !== 'active') {
    await notifyUser({
      userId: user._id,
      type: 'account_status',
      title: 'Account status changed',
      body: `Your account has been ${status}. Contact support if you believe this is a mistake.`,
    });
  }

  res.json(toPublicUser(user));
});

export const listAuditLogs = asyncHandler(async (req, res) => {
  const { page = 1, limit = 30 } = req.query;
  const skip = (Number(page) - 1) * Number(limit);
  const [items, total] = await Promise.all([
    AuditLog.find().sort({ createdAt: -1 }).skip(skip).limit(Number(limit)).populate('actorId', 'fullName email'),
    AuditLog.countDocuments(),
  ]);
  res.json({ items, total, page: Number(page), limit: Number(limit) });
});
