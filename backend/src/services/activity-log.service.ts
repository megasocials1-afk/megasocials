import { query } from '../db/pool.js';
import { v4 as uuidv4 } from 'uuid';

export class ActivityLogService {
  static async log(userId: string | null, action: string, details: any, ip?: string | null, userAgent?: string | null) {
    await query(
      `INSERT INTO activity_logs (id, user_id, action, details, ip, user_agent)
       VALUES ($1, $2, $3, $4, $5, $6)`,
      [uuidv4(), userId, action, details || {}, ip || null, userAgent || null]
    );
    return { success: true };
  }

  static async getLogs(limit: number = 100) {
    const res = await query(
      `SELECT al.*, u.email FROM activity_logs al
       LEFT JOIN users u ON al.user_id = u.id
       ORDER BY al.created_at DESC LIMIT $1`,
      [limit]
    );
    return res.rows;
  }

  static async getLogsByUser(userId: string, limit: number = 50) {
    const res = await query(
      `SELECT * FROM activity_logs WHERE user_id = $1 ORDER BY created_at DESC LIMIT $2`,
      [userId, limit]
    );
    return res.rows;
  }
}
