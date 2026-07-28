import { db } from '../db/pool.js';

export class AdminService {
  static async getAdminPermissions(adminUserId: string): Promise<string[]> {
    const res = await db.query('SELECT permissions FROM admin_users WHERE user_id = $1', [adminUserId]);
    return res.rows[0]?.permissions || [];
  }

  static async checkPermission(adminUserId: string, required: string): Promise<boolean> {
    if (!adminUserId) return false;
    const perms = await this.getAdminPermissions(adminUserId);
    return perms.includes(required) || perms.includes('*');
  }

  static async grantAdmin(userId: string, permissions: string[], grantorId: string) {
    await db.query(
      `INSERT INTO admin_users (user_id, permissions) VALUES ($1, $2) ON CONFLICT (user_id) DO UPDATE SET permissions = $2`,
      [userId, permissions]
    );
    await db.query('UPDATE users SET role = $1 WHERE id = $2', ['admin', userId]);
  }

  static async revokeAdmin(userId: string) {
    await db.query('DELETE FROM admin_users WHERE user_id = $1', [userId]);
    await db.query('UPDATE users SET role = $1 WHERE id = $2', ['user', userId]);
  }
}
