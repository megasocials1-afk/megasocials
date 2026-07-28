import { WalletService } from '../services/wallet.service.js';
import { db } from '../db/pool.js';

export default {
  getBalance: async (req: any, res: any) => {
    try {
      const userId = req.user?.id || req.query.userId;
      const balance = await WalletService.getBalance(userId);
      res.json({ balance });
    } catch {
      res.status(400).json({ error: 'Failed to get balance' });
    }
  },
  getTransactions: async (req: any, res: any) => {
    try {
      const userId = req.user?.id || req.query.userId;
      const result = await db.query('SELECT * FROM wallet_transactions WHERE user_id = $1 ORDER BY created_at DESC', [userId]);
      res.json(result.rows);
    } catch {
      res.status(400).json({ error: 'Failed to get transactions' });
    }
  }
};
