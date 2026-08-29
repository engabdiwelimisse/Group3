import { z } from 'zod';

export const submitBeneficiarySchema = z.object({
  fullName: z.string().min(2).max(100),
  idDocumentUrl: z.string().url().optional(),
});
