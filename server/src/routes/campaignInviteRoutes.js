import { Router } from 'express';
import * as campaignMemberController from '../controllers/campaignMemberController.js';
import { requireAuth } from '../middleware/auth.js';

const router = Router();

router.get('/mine', requireAuth, campaignMemberController.listMyInvites);
router.post('/:memberId/accept', requireAuth, campaignMemberController.acceptInvite);

export default router;
