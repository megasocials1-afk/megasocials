import { db } from '../db/pool.js';
import { WalletService } from '../services/wallet.service.js';
export default {
    getProfile: async (req, res) => {
        try {
            const userId = req.user.id;
            const result = await db.query('SELECT id, email, username, balance, status, role, referral_code FROM users WHERE id = $1', [userId]);
            res.json(result.rows[0]);
        }
        catch (err) {
            res.status(400).json({ error: 'Failed to get profile' });
        }
    },
    updateProfile: async (req, res) => {
        try {
            const { username, email } = req.body;
            const userId = req.user.id;
            await db.query('UPDATE users SET username = COALESCE($1, username), email = COALESCE($2, email), updated_at = NOW() WHERE id = $3', [username, email, userId]);
            res.json({ success: true });
        }
        catch (err) {
            res.status(400).json({ error: 'Failed to update profile' });
        }
    },
    getBalance: async (req, res) => {
        try {
            const balance = await WalletService.getBalance(req.user.id);
            res.json({ balance });
        }
        catch (err) {
            res.status(400).json({ error: 'Failed to get balance' });
        }
    },
    getTransactions: async (req, res) => {
        try {
            const { limit = 50, offset = 0 } = req.query;
            const transactions = await WalletService.getTransactions(req.user.id, parseInt(limit), parseInt(offset));
            res.json(transactions);
        }
        catch (err) {
            res.status(400).json({ error: 'Failed to get transactions' });
        }
    },
};
//# sourceMappingURL=user.routes.js.map