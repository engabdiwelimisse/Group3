import Notification from '../models/Notification.js';

export async function notifyUser({ userId, type, title, body, targetUrl }) {
  try {
    await Notification.create({ userId, type, title, body, targetUrl });
  } catch (err) {
    // A failed notification must never break the action that triggered it.
    console.error('[notificationService] failed to create notification:', err.message);
  }
}
