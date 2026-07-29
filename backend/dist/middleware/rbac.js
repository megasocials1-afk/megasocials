import { AdminService } from '../services/admin.service.js';
export const rbac = (roles) => {
    return (req, res, next) => {
        const user = req.user;
        if (!user || !roles.includes(user.role)) {
            return res.status(403).json({ error: 'Forbidden - Insufficient role' });
        }
        next();
    };
};
export const requirePermission = (permission) => {
    return async (req, res, next) => {
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
export const requireAdminOrSelf = (paramName = 'id') => {
    return (req, res, next) => {
        const user = req.user;
        const targetId = req.params[paramName];
        if (user.role === 'super_admin' || user.role === 'admin' || user.id === targetId) {
            return next();
        }
        return res.status(403).json({ error: 'Forbidden - Cannot access this resource' });
    };
};
//# sourceMappingURL=rbac.js.map