import { Router } from 'express';
import * as payoutAccountController from '../controllers/payoutAccountController.js';
import { requireAuth } from '../middleware/auth.js';
import { validate } from '../middleware/validate.js';
import { createPayoutAccountSchema } from '../validators/payoutAccountValidators.js';

const router = Router();

router.get('/mine', requireAuth, payoutAccountController.listMyPayoutAccounts);
router.post('/', requireAuth, validate(createPayoutAccountSchema), payoutAccountController.createPayoutAccount);

export default router;
