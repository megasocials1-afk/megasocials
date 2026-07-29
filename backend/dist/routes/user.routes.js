import { db } from '../db/pool.js';
export default {
    getProfile: async (req, res) => {
        try {
            const userId = req.user?.id || req.query.userId;
            const result = await db.query('SELECT id, email, username, balance, status, role FROM users WHERE id = $1', [userId]);
            res.json(result.rows[0]);
        }
        catch {
            res.status(400).json({ error: 'Failed to get profile' });
        }
    },
    updateProfile: async (req, res) => {
        try {
            const { username, email } = req.body;
            const userId = req.user?.id || req.query.userId;
            await db.query('UPDATE users SET username = COALESCE($1, username), email = COALESCE($2, email) WHERE id = $3', [username, email, userId]);
            res.json({ success: true });
        }
        catch {
            res.status(400).json({ error: 'Failed to update profile' });
        }
    }
};
