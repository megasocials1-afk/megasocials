import { db } from '../db/pool.js';
import { WalletService } from '../services/wallet.service.js';
import { AdminService } from '../services/admin.service.js';
import { ServiceService } from '../services/service.service.js';
export default {
    getUsers: async (req, res) => {
        try {
            const result = await db.query('SELECT id, email, username, balance, status, role, created_at, suspension_reason FROM users');
            res.json(result.rows);
        }
        catch {
            res.status(400).json({ error: 'Failed to get users' });
        }
    },
    updateUser: async (req, res) => {
        try {
            const { id } = req.params;
            const { status, role, balance, suspension_reason } = req.body;
            if (balance !== undefined) {
                const current = await WalletService.getBalance(id);
                const diff = balance - current;
                if (diff > 0)
                    await WalletService.credit(id, diff, 'manual', null, 'Admin balance adjustment');
                else if (diff < 0)
                    await WalletService.debit(id, -diff, 'manual', null, 'Admin balance adjustment');
            }
            const updates = {};
            if (status)
                updates.status = status;
            if (role)
                updates.role = role;
            if (suspension_reason !== undefined)
                updates.suspension_reason = suspension_reason;
            if (Object.keys(updates).length) {
                const setClause = Object.keys(updates).map((k, i) => `${k} = $${i + 2}`).join(', ');
                const values = [id, ...Object.values(updates)];
                await db.query(`UPDATE users SET ${setClause}, updated_at = NOW() WHERE id = $1`, values);
            }
            if (role === 'admin') {
                const perms = ['manage_orders', 'view_users'];
                await AdminService.grantAdmin(id, perms, req.user?.id || 'admin');
            }
            else if (role === 'user') {
                await AdminService.revokeAdmin(id);
            }
            res.json({ success: true });
        }
        catch (err) {
            res.status(400).json({ error: err.message });
        }
    },
    suspendUser: async (req, res) => {
        try {
            const { id } = req.params;
            const { reason, action } = req.body;
            let newStatus;
            if (action === 'suspend')
                newStatus = 'suspended';
            else if (action === 'ban')
                newStatus = 'banned';
            else
                newStatus = 'active';
            await db.query('UPDATE users SET status = $1, suspension_reason = $2, suspended_by = $3, banned_at = $4 WHERE id = $5', [newStatus, reason || null, req.user?.id || 'admin', action === 'ban' ? new Date() : null, id]);
            res.json({ success: true });
        }
        catch {
            res.status(400).json({ error: 'Failed to suspend user' });
        }
    },
    getAdminPermissions: async (req, res) => {
        try {
            const { userId } = req.params;
            const perms = await AdminService.getAdminPermissions(userId);
            res.json({ permissions: perms });
        }
        catch {
            res.status(400).json({ error: 'Failed to get permissions' });
        }
    },
    updateAdminPermissions: async (req, res) => {
        try {
            const { userId } = req.params;
            const { permissions } = req.body;
            await db.query('UPDATE admin_users SET permissions = $1 WHERE user_id = $2', [permissions, userId]);
            res.json({ success: true });
        }
        catch {
            res.status(400).json({ error: 'Failed to update permissions' });
        }
    },
    getProviders: async (req, res) => {
        try {
            const result = await db.query('SELECT * FROM providers ORDER BY created_at DESC');
            res.json(result.rows);
        }
        catch {
            res.status(400).json({ error: 'Failed to get providers' });
        }
    },
    createProvider: async (req, res) => {
        try {
            const { name, api_url, api_key, api_secret, type, config } = req.body;
            const result = await db.query(`INSERT INTO providers (id, name, api_url, api_key, api_secret, type, config, status) VALUES (gen_random_uuid(), $1, $2, $3, $4, $5, $6, 'active') RETURNING *`, [name, api_url, api_key, api_secret, type || 'smmrug', config || {}]);
            res.json(result.rows[0]);
        }
        catch {
            res.status(400).json({ error: 'Failed to create provider' });
        }
    },
    updateProvider: async (req, res) => {
        try {
            const { id } = req.params;
            const fields = req.body;
            const updates = Object.keys(fields).map((k, i) => `${k} = $${i + 2}`).join(', ');
            const values = [id, ...Object.values(fields)];
            await db.query(`UPDATE providers SET ${updates}, updated_at = NOW() WHERE id = $1`, values);
            res.json({ success: true });
        }
        catch {
            res.status(400).json({ error: 'Failed to update provider' });
        }
    },
    syncServices: async (req, res) => {
        try {
            const { providerId } = req.body;
            if (!providerId)
                return res.status(400).json({ error: 'providerId required' });
            await ServiceService.syncServices(providerId);
            res.json({ success: true });
        }
        catch {
            res.status(400).json({ error: 'Failed to sync services' });
        }
    },
    getAllOrders: async (req, res) => {
        try {
            const { limit = 50, offset = 0 } = req.query;
            const result = await db.query(`SELECT o.*, u.email, u.username FROM orders o JOIN users u ON o.user_id = u.id ORDER BY o.created_at DESC LIMIT $1 OFFSET $2`, [limit, offset]);
            res.json(result.rows);
        }
        catch {
            res.status(400).json({ error: 'Failed to get orders' });
        }
    },
    updateOrderStatus: async (req, res) => {
        try {
            const { id } = req.params;
            const { status } = req.body;
            await db.query('UPDATE orders SET status = $1, updated_at = NOW() WHERE id = $2', [status, id]);
            res.json({ success: true });
        }
        catch {
            res.status(400).json({ error: 'Failed to update order status' });
        }
    },
    getSettings: async (req, res) => {
        try {
            const result = await db.query('SELECT * FROM settings');
            res.json(result.rows);
        }
        catch {
            res.status(400).json({ error: 'Failed to get settings' });
        }
    },
    updateSetting: async (req, res) => {
        try {
            const { key, value } = req.body;
            await db.query('UPDATE settings SET value = $1, updated_at = NOW() WHERE key = $2', [value, key]);
            res.json({ success: true });
        }
        catch {
            res.status(400).json({ error: 'Failed to update setting' });
        }
    },
    getActivityLogs: async (req, res) => {
        try {
            const { limit = 100 } = req.query;
            const result = await db.query(`SELECT al.*, u.email FROM activity_logs al LEFT JOIN users u ON al.user_id = u.id ORDER BY al.created_at DESC LIMIT $1`, [limit]);
            res.json(result.rows);
        }
        catch {
            res.status(400).json({ error: 'Failed to get logs' });
        }
    },
    getDashboardStats: async (req, res) => {
        try {
            const totalUsers = await db.query('SELECT COUNT(*) FROM users');
            const totalOrders = await db.query('SELECT COUNT(*) FROM orders');
            const totalRevenue = await db.query("SELECT SUM(price) FROM orders WHERE status = 'completed'");
            const pendingOrders = await db.query("SELECT COUNT(*) FROM orders WHERE status = 'pending'");
            const balanceSum = await db.query('SELECT SUM(balance) FROM users');
            res.json({
                totalUsers: parseInt(totalUsers.rows[0].count),
                totalOrders: parseInt(totalOrders.rows[0].count),
                totalRevenue: parseFloat(totalRevenue.rows[0].sum || '0'),
                pendingOrders: parseInt(pendingOrders.rows[0].count),
                totalBalance: parseFloat(balanceSum.rows[0].sum || '0'),
            });
        }
        catch {
            res.status(400).json({ error: 'Failed to get stats' });
        }
    }
};
