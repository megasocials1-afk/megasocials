import { AdminService } from '../services/admin.service.js';
import { WalletService } from '../services/wallet.service.js';
import { ServiceService } from '../services/service.service.js';
import { ProviderService } from '../services/provider.service.js';
import { ActivityLogService } from '../services/activity-log.service.js';
import { authMiddleware } from '../middleware/auth.js';
import { rbac, requirePermission } from '../middleware/rbac.js';

export default {
  getUsers: async (req: any, res: any) => {
    try {
      const { status, role } = req.query;
      const users = await AdminService.getUsers({ status, role });
      res.json(users);
    } catch (err) {
      res.status(400).json({ error: 'Failed to get users' });
    }
  },
  getUser: async (req: any, res: any) => {
    try {
      const { id } = req.params;
      const users = await AdminService.getUsers();
      const user = users.find(u => u.id === id);
      if (!user) return res.status(404).json({ error: 'User not found' });
      res.json(user);
    } catch (err) {
      res.status(400).json({ error: 'Failed to get user' });
    }
  },
  updateUser: async (req: any, res: any) => {
    try {
      const { id } = req.params;
      const { status, role, balance, suspension_reason } = req.body;
      if (balance !== undefined) {
        const current = await WalletService.getBalance(id);
        const diff = balance - current;
        if (diff > 0) await WalletService.credit(id, diff, 'manual', null, 'Admin balance adjustment');
        else if (diff < 0) await WalletService.debit(id, -diff, 'manual', null, 'Admin balance adjustment');
      }
      await AdminService.updateUser(id, { status, role, balance, suspension_reason });
      await ActivityLogService.log(req.user.id, 'admin_update_user', { userId: id, updates: { status, role, balance } }, req.ip, req.headers['user-agent']);
      res.json({ success: true });
    } catch (err: any) {
      res.status(400).json({ error: err.message });
    }
  },
  suspendUser: async (req: any, res: any) => {
    try {
      const { id } = req.params;
      const { action, reason } = req.body;
      await AdminService.suspendUser(id, action, reason, req.user.id);
      await ActivityLogService.log(req.user.id, `admin_${action}_user`, { userId: id, reason }, req.ip, req.headers['user-agent']);
      res.json({ success: true });
    } catch (err: any) {
      res.status(400).json({ error: err.message });
    }
  },
  getAdminPermissions: async (req: any, res: any) => {
    try {
      const { userId } = req.params;
      const perms = await AdminService.getAdminPermissions(userId);
      res.json({ permissions: perms });
    } catch (err) {
      res.status(400).json({ error: 'Failed to get permissions' });
    }
  },
  updateAdminPermissions: async (req: any, res: any) => {
    try {
      const { userId } = req.params;
      const { permissions } = req.body;
      await AdminService.grantAdmin(userId, permissions, req.user.id);
      await ActivityLogService.log(req.user.id, 'admin_update_permissions', { userId, permissions }, req.ip, req.headers['user-agent']);
      res.json({ success: true });
    } catch (err: any) {
      res.status(400).json({ error: err.message });
    }
  },
  getProviders: async (req: any, res: any) => {
    try {
      const providers = await ProviderService.listProviders();
      res.json(providers);
    } catch (err) {
      res.status(400).json({ error: 'Failed to get providers' });
    }
  },
  createProvider: async (req: any, res: any) => {
    try {
      const provider = await ProviderService.createProvider(req.body);
      await ActivityLogService.log(req.user.id, 'admin_create_provider', { providerId: provider.id }, req.ip, req.headers['user-agent']);
      res.json(provider);
    } catch (err: any) {
      res.status(400).json({ error: err.message });
    }
  },
  updateProvider: async (req: any, res: any) => {
    try {
      const { id } = req.params;
      await ProviderService.updateProvider(id, req.body);
      await ActivityLogService.log(req.user.id, 'admin_update_provider', { providerId: id }, req.ip, req.headers['user-agent']);
      res.json({ success: true });
    } catch (err: any) {
      res.status(400).json({ error: err.message });
    }
  },
  deleteProvider: async (req: any, res: any) => {
    try {
      const { id } = req.params;
      await ProviderService.deleteProvider(id);
      await ActivityLogService.log(req.user.id, 'admin_delete_provider', { providerId: id }, req.ip, req.headers['user-agent']);
      res.json({ success: true });
    } catch (err: any) {
      res.status(400).json({ error: err.message });
    }
  },
  syncServices: async (req: any, res: any) => {
    try {
      const { providerId } = req.body;
      if (!providerId) return res.status(400).json({ error: 'providerId required' });
      const result = await ServiceService.syncServices(providerId);
      await ActivityLogService.log(req.user.id, 'admin_sync_services', { providerId, count: result.count }, req.ip, req.headers['user-agent']);
      res.json(result);
    } catch (err: any) {
      res.status(400).json({ error: err.message });
    }
  },
  getOrders: async (req: any, res: any) => {
    try {
      const { limit = 50, offset = 0 } = req.query;
      const orders = await OrderService.getAllOrders(parseInt(limit), parseInt(offset));
      res.json(orders);
    } catch (err) {
      res.status(400).json({ error: 'Failed to get orders' });
    }
  },
  updateOrderStatus: async (req: any, res: any) => {
    try {
      const { id } = req.params;
      const { status } = req.body;
      await OrderService.updateStatus(id, status);
      await ActivityLogService.log(req.user.id, 'admin_update_order_status', { orderId: id, status }, req.ip, req.headers['user-agent']);
      res.json({ success: true });
    } catch (err: any) {
      res.status(400).json({ error: err.message });
    }
  },
  getSettings: async (req: any, res: any) => {
    try {
      const settings = await SettingsService.getAll();
      res.json(settings);
    } catch (err) {
      res.status(400).json({ error: 'Failed to get settings' });
    }
  },
  updateSetting: async (req: any, res: any) => {
    try {
      const { key, value } = req.body;
      if (!key) return res.status(400).json({ error: 'key is required' });
      await SettingsService.set(key, value);
      await ActivityLogService.log(req.user.id, 'admin_update_setting', { key, value }, req.ip, req.headers['user-agent']);
      res.json({ success: true });
    } catch (err: any) {
      res.status(400).json({ error: err.message });
    }
  },
  getLogs: async (req: any, res: any) => {
    try {
      const { limit = 100 } = req.query;
      const logs = await ActivityLogService.getLogs(parseInt(limit));
      res.json(logs);
    } catch (err) {
      res.status(400).json({ error: 'Failed to get logs' });
    }
  },
  getDashboardStats: async (req: any, res: any) => {
    try {
      const stats = await AdminService.getDashboardStats();
      res.json(stats);
    } catch (err) {
      res.status(400).json({ error: 'Failed to get dashboard stats' });
    }
  },
};
