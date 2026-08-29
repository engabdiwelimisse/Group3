import { z } from 'zod';

const CATEGORIES = [
  'Medical', 'Education', 'Emergency', 'Family', 'Funeral', 'Community',
  'Mosque', 'School', 'Orphan Support', 'Disaster Relief', 'Business/Startup',
  'NGO', 'Public Projects', 'Other',
];

export const createCampaignSchema = z.object({
  title: z.object({
    so: z.string().min(5).max(150),
    en: z.string().max(150).optional(),
  }),
  story: z.object({
    so: z.string().min(20),
    en: z.string().optional(),
  }),
  category: z.enum(CATEGORIES),
  subcategory: z.string().optional(),
  tags: z.array(z.string()).optional(),
  goalAmount: z.number().positive(),
  currency: z.string().optional().default('USD'),
  region: z.string().optional(),
  endDate: z.string().datetime().optional(),
  coverImageUrl: z.string().url().optional(),
});

export const updateCampaignSchema = createCampaignSchema.partial();

export const createUpdateSchema = z.object({
  text: z.string().min(10),
  imageUrl: z.string().url().optional(),
});

export const createCommentSchema = z.object({
  text: z.string().min(1).max(1000),
});
