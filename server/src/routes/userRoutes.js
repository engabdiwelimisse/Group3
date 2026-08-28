import { Router } from 'express';
import * as userController from '../controllers/userController.js';
import { requireAuth } from '../middleware/auth.js';
import { validate } from '../middleware/validate.js';
import { authRateLimiter } from '../middleware/rateLimit.js';
import { requestOrganizerAccessSchema, confirmOrganizerAccessSchema } from '../validators/organizerValidators.js';

const router = Router();

router.get('/me', requireAuth, userController.getMe);
router.patch('/me', requireAuth, userController.updateMe);

router.post(
  '/me/request-organizer-access',
  requireAuth,
  authRateLimiter,
  validate(requestOrganizerAccessSchema),
  userController.requestOrganizerAccessController
);
router.post(
  '/me/confirm-organizer-access',
  requireAuth,
  authRateLimiter,
  validate(confirmOrganizerAccessSchema),
  userController.confirmOrganizerAccessController
);

router.get('/me/followed-campaigns', requireAuth, userController.listFollowedCampaigns);
router.get('/me/saved-campaigns', requireAuth, userController.listSavedCampaigns);

export default router;
