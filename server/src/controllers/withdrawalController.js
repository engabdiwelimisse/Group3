import Campaign from '../models/Campaign.js';
import Beneficiary from '../models/Beneficiary.js';
import Withdrawal from '../models/Withdrawal.js';
import { asyncHandler } from '../utils/asyncHandler.js';
import { ApiError } from '../utils/ApiError.js';
import { logAudit } from '../services/auditLogService.js';
import { notifyUser } from '../services/notificationService.js';

// Beneficiary verification is a hard prerequisite — no withdrawal can be
// requested until beneficiary identity + payout account are verified (spec
// Section 15).
export const createWithdrawal = asyncHandler(async (req, res) => {
  const { campaignId, amount, payoutAccountId } = req.body;

  const campaign = await Campaign.findById(campaignId);
  if (!campaign) throw new ApiError(404, 'NOT_FOUND', 'Campaign not found');
  if (String(campaign.organizerId) !== String(req.user.id)) {
    throw new ApiError(403, 'FORBIDDEN', 'Only the organizer can request a withdrawal');
  }

  const beneficiary = await Beneficiary.findById(campaign.beneficiaryId);
  if (!beneficiary || beneficiary.verificationStatus !== 'verified' || !beneficiary.payoutAccountId) {
    throw new ApiError(
      412,
      'BENEFICIARY_NOT_VERIFIED',
      'Beneficiary identity and payout account must be verified before requesting a withdrawal'
    );
  }

  if (!amount || amount <= 0) {
    throw new ApiError(400, 'VALIDATION_ERROR', 'Withdrawal amount must be greater than zero', { amount: 'required' });
  }

  const activeWithdrawals = await Withdrawal.aggregate([
    {
      $match: {
        campaignId: campaign._id,
        status: { $in: ['pending', 'under_review', 'approved', 'processing', 'completed'] },
      },
    },
    { $group: { _id: null, total: { $sum: '$amount' } } },
  ]);
  const alreadyRequested = activeWithdrawals[0]?.total || 0;
  const available = campaign.raisedAmount - alreadyRequested;

  if (amount > available) {
    throw new ApiError(
      400,
      'INSUFFICIENT_FUNDS',
      `Requested amount exceeds available balance (available: ${available} ${campaign.currency})`,
      { amount: 'exceeds_available' }
    );
  }

  const withdrawal = await Withdrawal.create({
    campaignId: campaign._id,
    requestedBy: req.user.id,
    amount,
    payoutAccountId,
    status: 'pending',
  });

  res.status(201).json({ withdrawal, note: 'Payout providers are not yet integrated; admin will process this manually.' });
});

export const listMyWithdrawals = asyncHandler(async (req, res) => {
  const withdrawals = await Withdrawal.find({ requestedBy: req.user.id }).sort({ createdAt: -1 });
  res.json(withdrawals);
});

export const reviewWithdrawal = asyncHandler(async (req, res) => {
  const { status, reason } = req.body;
  const withdrawal = await Withdrawal.findById(req.params.id);
  if (!withdrawal) throw new ApiError(404, 'NOT_FOUND', 'Withdrawal not found');

  withdrawal.status = status;
  withdrawal.reviewedBy = req.user.id;
  withdrawal.reviewedAt = new Date();
  if (reason) withdrawal.reason = reason;
  await withdrawal.save();

  await logAudit({
    actorId: req.user.id,
    action: `withdrawal.${status}`,
    targetType: 'Withdrawal',
    targetId: withdrawal._id,
    metadata: { amount: withdrawal.amount, reason },
  });

  await notifyUser({
    userId: withdrawal.requestedBy,
    type: `withdrawal_${status}`,
    title: `Withdrawal ${status.replace(/_/g, ' ')}`,
    body: reason
      ? `Your withdrawal of $${withdrawal.amount} is now ${status.replace(/_/g, ' ')}. Reason: ${reason}`
      : `Your withdrawal of $${withdrawal.amount} is now ${status.replace(/_/g, ' ')}.`,
    targetUrl: '/organizer/withdrawals',
  });

  res.json(withdrawal);
});
