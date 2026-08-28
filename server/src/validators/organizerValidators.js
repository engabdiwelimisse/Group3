import { z } from 'zod';

export const requestOrganizerAccessSchema = z.object({
  fullName: z.string().min(2).max(100).optional(),
  purpose: z.string().max(300).optional(),
});
