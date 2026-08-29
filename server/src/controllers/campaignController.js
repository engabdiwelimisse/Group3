import Campaign from '../models/Campaign.js';
import Update from '../models/Update.js';
import Comment from '../models/Comment.js';
import Donation from '../models/Donation.js';
import Follow from '../models/Follow.js';
import Bookmark from '../models/Bookmark.js';
import { asyncHandler } from '../utils/asyncHandler.js';
import { ApiError } from '../utils/ApiError.js';
import { submitCampaign, canEditCampaign, isCampaignContributor, PUBLIC_STATUSES } from '../services/campaignService.js';
import { notifyUser } from '../services/notificationService.js';

// Real, derivable platform numbers only — never fabricate stats for the
// landing page (Design_Rules.md Rule 43).
export const getPublicStats = asyncHandler(async (req, res) => {
  const [totals, donorCount] = await Promise.all([
    Campaign.aggregate([
      { $match: { status: { $in: PUBLIC_STATUSES } } },
      { $group: { _id: null, totalRaised: { $sum: '$raisedAmount' }, campaignCount: { $sum: 1 } } },
    ]),
    Donation.distinct('donorId', { status: 'confirmed', donorId: { $ne: null } }),
  ]);

  res.json({
    totalRaised: totals[0]?.totalRaised || 0,
    campaignCount: totals[0]?.campaignCount || 0,
    donorCount: donorCount.length,
  });
});

export const listCampaigns = asyncHandler(async (req, res) => {
  const { category, region, q, page = 1, limit = 20 } = req.query;
  const filter = { status: { $in: PUBLIC_STATUSES } };
  if (category) filter.category = category;
  if (region) filter.region = region;
  if (q) filter.$text = { $search: q };

  const skip = (Number(page) - 1) * Number(limit);
  const [items, total] = await Promise.all([
    Campaign.find(filter).sort({ createdAt: -1 }).skip(skip).limit(Number(limit)),
    Campaign.countDocuments(filter),
  ]);

  res.json({ items, total, page: Number(page), limit: Number(limit) });
});

export const listMyCampaigns = asyncHandler(async (req, res) => {
  const campaigns = await Campaign.find({ organizerId: req.user.id }).sort({ createdAt: -1 });
  res.json(campaigns);
});

export const createCampaign = asyncHandler(async (req, res) => {
  const campaign = await Campaign.create({ ...req.body, organizerId: req.user.id, status: 'draft' });
  res.status(201).json(campaign);
});

export const getCampaign = asyncHandler(async (req, res) => {
  const campaign = await Campaign.findById(req.params.id);
  if (!campaign) throw new ApiError(404, 'NOT_FOUND', 'Campaign not found or unavailable');

  const isPublic = PUBLIC_STATUSES.includes(campaign.status);
  const isOwner = req.user && String(campaign.organizerId) === String(req.user.id);
  if (!isPublic && !isOwner) {
    throw new ApiError(404, 'NOT_FOUND', 'Campaign not found or unavailable');
  }

  res.json(campaign);
});

export const updateCampaign = asyncHandler(async (req, res) => {
  const campaign = await Campaign.findById(req.params.id);
  if (!campaign) throw new ApiError(404, 'NOT_FOUND', 'Campaign not found');
  if (!(await canEditCampaign(campaign, req.user.id))) {
    throw new ApiError(403, 'FORBIDDEN', 'Campaign cannot be edited in its current status');
  }

  Object.assign(campaign, req.body);
  await campaign.save();
  res.json(campaign);
});

export const submitCampaignForReview = asyncHandler(async (req, res) => {
  const campaign = await submitCampaign(req.params.id, req.user.id);
  res.json(campaign);
});

export const listUpdates = asyncHandler(async (req, res) => {
  const updates = await Update.find({ campaignId: req.params.id }).sort({ createdAt: -1 });
  res.json(updates);
});

export const postUpdate = asyncHandler(async (req, res) => {
  const campaign = await Campaign.findById(req.params.id);
  if (!campaign) throw new ApiError(404, 'NOT_FOUND', 'Campaign not found');
  if (!(await isCampaignContributor(campaign, req.user.id))) {
    throw new ApiError(403, 'FORBIDDEN', 'Only the organizer or co-organizer can post updates');
  }

  const update = await Update.create({ ...req.body, campaignId: campaign._id, authorId: req.user.id });

  const followers = await Follow.find({ campaignId: campaign._id }).select('userId');
  await Promise.all(
    followers.map((f) =>
      notifyUser({
        userId: f.userId,
        type: 'campaign_update',
        title: 'New update',
        body: `${campaign.title?.en || campaign.title?.so} posted a new update.`,
        targetUrl: `/campaigns/${campaign._id}`,
      })
    )
  );

  res.status(201).json(update);
});

// Toggle — POST to follow, DELETE to unfollow. Following is what powers the
// donor's "Followed campaigns" page and campaign-update notifications.
export const followCampaign = asyncHandler(async (req, res) => {
  await Follow.findOneAndUpdate(
    { userId: req.user.id, campaignId: req.params.id },
    { userId: req.user.id, campaignId: req.params.id },
    { upsert: true }
  );
  res.json({ following: true });
});

export const unfollowCampaign = asyncHandler(async (req, res) => {
  await Follow.deleteOne({ userId: req.user.id, campaignId: req.params.id });
  res.json({ following: false });
});

export const saveCampaign = asyncHandler(async (req, res) => {
  await Bookmark.findOneAndUpdate(
    { userId: req.user.id, campaignId: req.params.id },
    { userId: req.user.id, campaignId: req.params.id },
    { upsert: true }
  );
  res.json({ saved: true });
});

export const unsaveCampaign = asyncHandler(async (req, res) => {
  await Bookmark.deleteOne({ userId: req.user.id, campaignId: req.params.id });
  res.json({ saved: false });
});

// Tells the campaign detail page whether the current viewer already
// follows/has saved this campaign, so buttons render in the right state.
export const getMyCampaignInteractions = asyncHandler(async (req, res) => {
  const [following, saved] = await Promise.all([
    Follow.exists({ userId: req.user.id, campaignId: req.params.id }),
    Bookmark.exists({ userId: req.user.id, campaignId: req.params.id }),
  ]);
  res.json({ following: !!following, saved: !!saved });
});

// Public: last confirmed donations + a supporter count, so a visiting donor
// can see the campaign is real and active (Design_Rules.md Rule 19 — "how
// much has been raised" and social proof). Anonymous donors' names are
// never exposed, matching the promise made at donation time.
export const listCampaignDonations = asyncHandler(async (req, res) => {
  const { limit = 10 } = req.query;
  const campaignId = req.params.id;

  const [donations, supporterCount] = await Promise.all([
    Donation.find({ campaignId, status: 'confirmed' })
      .sort({ createdAt: -1 })
      .limit(Number(limit))
      .populate('donorId', 'fullName'),
    Donation.countDocuments({ campaignId, status: 'confirmed' }),
  ]);

  const items = donations.map((d) => ({
    _id: d._id,
    amount: d.amount,
    currency: d.currency,
    message: d.message,
    createdAt: d.createdAt,
    donorName: d.isAnonymous ? null : d.donorId?.fullName || null,
  }));

  res.json({ items, supporterCount });
});

export const listComments = asyncHandler(async (req, res) => {
  const comments = await Comment.find({ campaignId: req.params.id }).sort({ createdAt: -1 });
  res.json(comments);
});

export const postComment = asyncHandler(async (req, res) => {
  const campaign = await Campaign.findById(req.params.id);
  if (!campaign) throw new ApiError(404, 'NOT_FOUND', 'Campaign not found');

  const comment = await Comment.create({ ...req.body, campaignId: campaign._id, userId: req.user.id });
  res.status(201).json(comment);
});
