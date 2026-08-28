import { ApiError } from '../utils/ApiError.js';

export function requireRole(...allowedRoles) {
  return (req, res, next) => {
    const roles = req.user?.roles || [];
    const hasRole = roles.some((r) => allowedRoles.includes(r));
    if (!hasRole) {
      return next(new ApiError(403, 'FORBIDDEN', 'You do not have permission to perform this action'));
    }
    next();
  };
}

// Usage: pass a function (req) => ownerId that resolves the resource's owning
// user id (from req.resource, set by a prior loader middleware). Admins always pass.
export function requireOwnership(getOwnerId) {
  return (req, res, next) => {
    const roles = req.user?.roles || [];
    if (roles.includes('admin')) return next();

    const ownerId = getOwnerId(req);
    if (!ownerId || String(ownerId) !== String(req.user?.id)) {
      return next(new ApiError(403, 'FORBIDDEN', 'You do not own this resource'));
    }
    next();
  };
}
