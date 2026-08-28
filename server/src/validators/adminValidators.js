import { z } from 'zod';

export const reviewCampaignSchema = z.object({
  action: z.enum(['approve', 'reject', 'publish', 'suspend', 'restore', 'start_review']),
  reason: z.string().min(3).optional(),
});

export const confirmPaymentSchema = z.object({
  providerTransactionId: z.string().optional(),
});

export const confirmPaymentsBatchSchema = z.object({
  paymentIds: z.array(z.string()).min(1).max(500),
});
