import { z } from 'zod';

export const reviewCampaignSchema = z.object({
  action: z.enum(['approve', 'reject', 'publish', 'suspend', 'restore', 'start_review']),
  reason: z.string().min(3).optional(),
});

export const confirmPaymentSchema = z.object({
  providerTransactionId: z.string().optional(),
});
