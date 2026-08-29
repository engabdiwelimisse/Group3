import { z } from 'zod';

export const createPayoutAccountSchema = z.object({
  type: z.enum(['mobile_money', 'bank']),
  accountNumber: z.string().min(4).max(30),
  providerName: z.string().min(2).max(60),
});
