import { Request, Response, NextFunction } from 'express';
import { AdminService } from '../services/admin.service.js';

export const rbac = (roles: string[]) => {
  return (req: any, res: any, next: any) => {
    const user = req.user;
    if (!user || !roles.includes(user.role)) {
      return res.status(403).json({ error: 'Forbidden - Insufficient role' });
    }
    next();
  };
};

export const requirePermission = (permission: string) => {
  return async (req: any, res: any, next: any) => {
    if (req.user.role === 'super_admin') {
      return next();
    }
    const hasPermission = await AdminService.checkPermission(req.user.id, permission);
    if (!hasPermission) {
      return res.status(403).json({ error: 'Forbidden - Insufficient permission' });
    }
    next();
  };
};

export const requireAdminOrSelf = (paramName: string = 'id') => {
  return (req: any, res: any, next: any) => {
    const user = req.user;
    const targetId = req.params[paramName];
    if (user.role === 'super_admin' || user.role === 'admin' || user.id === targetId) {
      return next();
    }
    return res.status(403).json({ error: 'Forbidden - Cannot access this resource' });
  };
};
