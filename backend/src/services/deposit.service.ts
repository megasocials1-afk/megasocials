import { query } from '../db/pool.js';
import { v4 as uuidv4 } from 'uuid';

export class DepositService {
  static async createDeposit(userId: string, amount: number, method: string = 'manual') {
    const result = await query(
      `INSERT INTO deposits (id, user_id, amount, method, status, reference)
       VALUES ($1, $2, $3, $4, 'pending', $5) RETURNING *`,
      [uuidv4(), userId, amount, method, `DEP-${Date.now()}`]
    );
    return result.rows[0];
  }

  static async getUserDeposits(userId: string) {
    const result = await query('SELECT * FROM deposits WHERE user_id = $1 ORDER BY created_at DESC', [userId]);
    return result.rows;
  }

  static async getAllDeposits() {
    const result = await query('SELECT * FROM deposits ORDER BY created_at DESC');
    return result.rows;
  }

  static async approveDeposit(depositId: string, adminId: string) {
    const result = await query(
      `UPDATE deposits SET status = 'approved', approved_by = $1, updated_at = NOW() WHERE id = $2 RETURNING *`,
      [adminId, depositId]
    );
    return result.rows[0];
  }

  static async rejectDeposit(depositId: string, reason: string) {
    await query(
      `UPDATE deposits SET status = 'rejected', admin_notes = $1, updated_at = NOW() WHERE id = $2`,
      [reason, depositId]
    );
    return { success: true };
  }
}
