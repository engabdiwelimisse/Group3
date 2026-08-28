import { Router } from 'express';
import * as userController from '../controllers/userController.js';
import { requireAuth } from '../middleware/auth.js';
import { validate } from '../middleware/validate.js';
import { authRateLimiter } from '../middleware/rateLimit.js';
import { requestOrganizerAccessSchema } from '../validators/organizerValidators.js';

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
router.get('/organizer-access/confirm/:token', userController.confirmOrganizerAccessController);

router.get('/me/followed-campaigns', requireAuth, userController.listFollowedCampaigns);
router.get('/me/saved-campaigns', requireAuth, userController.listSavedCampaigns);

export default router;
