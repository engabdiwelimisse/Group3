import Campaign from '../models/Campaign.js';
import Donation from '../models/Donation.js';
import { asyncHandler } from '../utils/asyncHandler.js';
import { ApiError } from '../utils/ApiError.js';
import { PaymentService } from '../integrations/payments/PaymentService.js';
import { PUBLIC_STATUSES } from '../services/campaignService.js';

// Only the 'manual' provider is wired up until a real mobile-money/card/bank
// provider is verified and integrated (spec Section 14).
export const createDonation = asyncHandler(async (req, res) => {
  const campaign = await Campaign.findById(req.params.id);
  if (!campaign) throw new ApiError(404, 'NOT_FOUND', 'Campaign not found');

  if (!PUBLIC_STATUSES.includes(campaign.status)) {
    throw new ApiError(400, 'CAMPAIGN_NOT_OPEN', 'This campaign is not currently open for donations');
  }

  const { amount, isAnonymous, message, provider = 'manual' } = req.body;
  if (!amount || amount <= 0) {
    throw new ApiError(400, 'VALIDATION_ERROR', 'Donation amount must be greater than zero', { amount: 'required' });
  }

  const intent = await PaymentService.createPaymentIntent(provider, {
    campaignId: campaign._id,
    donorId: req.user?.id,
    amount,
    currency: campaign.currency,
  });

  const donation = await Donation.create({
    campaignId: campaign._id,
    donorId: req.user?.id,
    amount,
    currency: campaign.currency,
    isAnonymous: !!isAnonymous,
    message,
    paymentId: intent.paymentId,
    status: 'pending',
  });

  res.status(201).json({
    donation,
    payment: intent,
    note: provider === 'manual'
      ? 'Manual/admin-recorded donation created. Awaiting admin confirmation.'
      : 'Real payment providers are not yet integrated.',
  });
});

export const listMyDonations = asyncHandler(async (req, res) => {
  const donations = await Donation.find({ donorId: req.user.id })
    .sort({ createdAt: -1 })
    .populate('campaignId', 'title coverImageUrl category');
  res.json(donations);
});
