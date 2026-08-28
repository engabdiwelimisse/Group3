import AuditLog from '../models/AuditLog.js';

export async function logAudit({ actorId, actorType = 'admin', action, targetType, targetId, metadata }) {
  try {
    await AuditLog.create({ actorId, actorType, action, targetType, targetId, metadata });
  } catch (err) {
    // Audit logging must never break the primary action it's recording.
    console.error('[auditLogService] failed to write audit log:', err.message);
  }
}
