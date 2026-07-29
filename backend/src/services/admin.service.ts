import { query } from '../db/pool.js';
import { v4 as uuidv4 } from 'uuid';

export class AdminService {
  static async getAdminPermissions(adminUserId: string): Promise<string[]> {
    const res = await query('SELECT permissions FROM admin_users WHERE user_id = $1', [adminUserId]);
    return res.rows[0]?.permissions || [];
  }

  static async checkPermission(adminUserId: string, required: string): Promise<boolean> {
    if (!adminUserId) return false;
    const perms = await this.getAdminPermissions(adminUserId);
    return perms.includes(required) || perms.includes('*');
  }

  static async grantAdmin(userId: string, permissions: string[], grantorId: string) {
    await query(
      `INSERT INTO admin_users (user_id, permissions) VALUES ($1, $2)
       ON CONFLICT (user_id) DO UPDATE SET permissions = $2`,
      [userId, permissions]
    );
    await query('UPDATE users SET role = $1 WHERE id = $2', ['admin', userId]);
    return { success: true };
  }

  static async revokeAdmin(userId: string) {
    await query('DELETE FROM admin_users WHERE user_id = $1', [userId]);
    await query('UPDATE users SET role = $1 WHERE id = $2', ['user', userId]);
    return { success: true };
  }

  static async getDashboardStats() {
    const totalUsers = await query('SELECT COUNT(*) FROM users');
    const totalOrders = await query('SELECT COUNT(*) FROM orders');
    const totalRevenue = await query("SELECT SUM(price) FROM orders WHERE status = 'completed'");
    const pendingOrders = await query("SELECT COUNT(*) FROM orders WHERE status = 'pending'");
    const balanceSum = await query('SELECT SUM(balance) FROM users');
    return {
      totalUsers: parseInt(totalUsers.rows[0].count),
      totalOrders: parseInt(totalOrders.rows[0].count),
      totalRevenue: parseFloat(totalRevenue.rows[0].sum || '0'),
      pendingOrders: parseInt(pendingOrders.rows[0].count),
      totalBalance: parseFloat(balanceSum.rows[0].sum || '0'),
    };
  }

  static async getUsers(filters?: { status?: string; role?: string }) {
    let queryText = 'SELECT id, email, username, balance, status, role, created_at, suspension_reason FROM users';
    const conditions: string[] = [];
    const values: any[] = [];
    let paramIndex = 1;
    if (filters?.status) {
      conditions.push(`status = $${paramIndex++}`);
      values.push(filters.status);
    }
    if (filters?.role) {
      conditions.push(`role = $${paramIndex++}`);
      values.push(filters.role);
    }
    if (conditions.length) {
      queryText += ' WHERE ' + conditions.join(' AND ');
    }
    queryText += ' ORDER BY created_at DESC';
    const res = await query(queryText, values);
    return res.rows;
  }

  static async updateUser(userId: string, data: { status?: string; role?: string; balance?: number; suspension_reason?: string }) {
    const updates: string[] = [];
    const values: any[] = [];
    let paramIndex = 1;
    if (data.status) {
      updates.push(`status = $${paramIndex++}`);
      values.push(data.status);
    }
    if (data.role) {
      updates.push(`role = $${paramIndex++}`);
      values.push(data.role);
    }
    if (data.balance !== undefined) {
      updates.push(`balance = $${paramIndex++}`);
      values.push(data.balance);
    }
    if (data.suspension_reason !== undefined) {
      updates.push(`suspension_reason = $${paramIndex++}`);
      values.push(data.suspension_reason);
    }
    if (!updates.length) throw new Error('No fields to update');
    values.push(userId);
    await query(
      `UPDATE users SET ${updates.join(', ')}, updated_at = NOW() WHERE id = $${paramIndex}`,
      values
    );
    return { success: true };
  }

  static async suspendUser(userId: string, action: 'suspend' | 'ban' | 'reactivate', reason?: string, adminId?: string) {
    let newStatus: string;
    if (action === 'suspend') newStatus = 'suspended';
    else if (action === 'ban') newStatus = 'banned';
    else newStatus = 'active';
    await query(
      'UPDATE users SET status = $1, suspension_reason = $2, suspended_by = $3, banned_at = $4 WHERE id = $5',
      [newStatus, reason || null, adminId || null, action === 'ban' ? new Date() : null, userId]
    );
    return { success: true };
  }
}
