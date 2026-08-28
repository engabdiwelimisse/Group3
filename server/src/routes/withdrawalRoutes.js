import { Router } from 'express';
import * as withdrawalController from '../controllers/withdrawalController.js';
import { requireAuth } from '../middleware/auth.js';
import { requireRole } from '../middleware/rbac.js';

const router = Router();

router.get('/mine', requireAuth, requireRole('organizer', 'beneficiary'), withdrawalController.listMyWithdrawals);
router.post('/', requireAuth, requireRole('organizer', 'beneficiary'), withdrawalController.createWithdrawal);
router.patch('/:id/review', requireAuth, requireRole('admin'), withdrawalController.reviewWithdrawal);

export default router;
