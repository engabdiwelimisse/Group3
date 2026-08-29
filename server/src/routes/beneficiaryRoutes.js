import { Router } from 'express';
import * as beneficiaryController from '../controllers/beneficiaryController.js';
import { requireAuth } from '../middleware/auth.js';
import { validate } from '../middleware/validate.js';
import { submitBeneficiarySchema } from '../validators/beneficiaryValidators.js';

const router = Router();

router.get('/me', requireAuth, beneficiaryController.getMyBeneficiaryProfile);
router.post('/me', requireAuth, validate(submitBeneficiarySchema), beneficiaryController.submitMyBeneficiaryProfile);

export default router;
