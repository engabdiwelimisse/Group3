import { Router } from 'express';
import * as notificationController from '../controllers/notificationController.js';
import { requireAuth } from '../middleware/auth.js';

const router = Router();

router.get('/mine', requireAuth, notificationController.listMyNotifications);
router.patch('/:id/read', requireAuth, notificationController.markNotificationRead);
router.patch('/read-all', requireAuth, notificationController.markAllNotificationsRead);

export default router;
