import Report from '../models/Report.js';
import { asyncHandler } from '../utils/asyncHandler.js';
import { ApiError } from '../utils/ApiError.js';
import { logAudit } from '../services/auditLogService.js';

export const createReport = asyncHandler(async (req, res) => {
  const { targetType, targetId, reason } = req.body;
  const report = await Report.create({
    reporterId: req.user.id,
    targetType,
    targetId,
    reason,
  });
  res.status(201).json(report);
});

export const listReports = asyncHandler(async (req, res) => {
  const { status, page = 1, limit = 20 } = req.query;
  const filter = {};
  if (status) filter.status = status;

  const skip = (Number(page) - 1) * Number(limit);
  const [items, total] = await Promise.all([
    Report.find(filter).sort({ createdAt: -1 }).skip(skip).limit(Number(limit)).populate('reporterId', 'fullName email'),
    Report.countDocuments(filter),
  ]);

  res.json({ items, total, page: Number(page), limit: Number(limit) });
});

export const reviewReport = asyncHandler(async (req, res) => {
  const { status, reviewNote } = req.body; // 'reviewed' | 'dismissed'
  const report = await Report.findById(req.params.id);
  if (!report) throw new ApiError(404, 'NOT_FOUND', 'Report not found');

  report.status = status;
  report.reviewedBy = req.user.id;
  if (reviewNote) report.reviewNote = reviewNote;
  await report.save();

  await logAudit({
    actorId: req.user.id,
    action: `report.${status}`,
    targetType: 'Report',
    targetId: report._id,
    metadata: { targetType: report.targetType, targetId: report.targetId },
  });

  res.json(report);
});
