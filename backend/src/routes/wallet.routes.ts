import { WalletService } from '../services/wallet.service.js';
import { ActivityLogService } from '../services/activity-log.service.js';

export default {
  getBalance: async (req: any, res: any) => {
    try {
      const balance = await WalletService.getBalance(req.user.id);
      res.json({ balance });
    } catch (err) {
      res.status(400).json({ error: 'Failed to get balance' });
    }
  },
  getTransactions: async (req: any, res: any) => {
    try {
      const { limit = 50, offset = 0 } = req.query;
      const transactions = await WalletService.getTransactions(req.user.id, parseInt(limit), parseInt(offset));
      res.json(transactions);
    } catch (err) {
      res.status(400).json({ error: 'Failed to get transactions' });
    }
  },
  credit: async (req: any, res: any) => {
    try {
      const { userId, amount, description } = req.body;
      if (!userId || !amount) {
        return res.status(400).json({ error: 'userId and amount are required' });
      }
      const newBalance = await WalletService.credit(userId, amount, 'manual', null, description || 'Admin credit');
      await ActivityLogService.log(req.user.id, 'admin_credit', { userId, amount, description }, req.ip, req.headers['user-agent']);
      res.json({ success: true, balance: newBalance });
    } catch (err: any) {
      res.status(400).json({ error: err.message });
    }
  },
  debit: async (req: any, res: any) => {
    try {
      const { userId, amount, description } = req.body;
      if (!userId || !amount) {
        return res.status(400).json({ error: 'userId and amount are required' });
      }
      const newBalance = await WalletService.debit(userId, amount, 'manual', null, description || 'Admin debit');
      await ActivityLogService.log(req.user.id, 'admin_debit', { userId, amount, description }, req.ip, req.headers['user-agent']);
      res.json({ success: true, balance: newBalance });
    } catch (err: any) {
      res.status(400).json({ error: err.message });
    }
  },
};
