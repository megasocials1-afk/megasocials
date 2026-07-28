import { db } from '../db/pool.js';

export default {
  createDeposit: async (req: any, res: any) => {
    try {
      const userId = req.user?.id || req.body.userId;
      const { amount } = req.body;
      const result = await db.query(
        `INSERT INTO deposits (id, user_id, amount, method, status) VALUES (gen_random_uuid(), $1, $2, 'manual', 'pending') RETURNING *`,
        [userId, amount]
      );
      res.json(result.rows[0]);
    } catch (err: any) {
      res.status(400).json({ error: err.message });
    }
  },
  getDeposits: async (req: any, res: any) => {
    try {
      const userId = req.user?.id || req.query.userId;
      const result = await db.query('SELECT * FROM deposits WHERE user_id = $1 ORDER BY created_at DESC', [userId]);
      res.json(result.rows);
    } catch {
      res.status(400).json({ error: 'Failed to get deposits' });
    }
  },
  webhook: async (req: any, res: any) => {
    res.json({ success: true });
  }
};
