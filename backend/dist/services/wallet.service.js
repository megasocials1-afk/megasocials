import { db, query } from '../db/pool.js';
import { v4 as uuidv4 } from 'uuid';
export class WalletService {
    static async getBalance(userId) {
        const res = await query('SELECT balance FROM users WHERE id = $1', [userId]);
        return parseFloat(res.rows[0]?.balance || '0');
    }
    static async getTransactions(userId, limit = 50, offset = 0) {
        const res = await query('SELECT * FROM wallet_transactions WHERE user_id = $1 ORDER BY created_at DESC LIMIT $2 OFFSET $3', [userId, limit, offset]);
        return res.rows;
    }
    static async credit(userId, amount, type, referenceId, description) {
        if (amount <= 0)
            throw new Error('Amount must be positive');
        const client = await db.connect();
        try {
            await client.query('BEGIN');
            const update = await client.query('UPDATE users SET balance = balance + $1 WHERE id = $2 RETURNING balance', [amount, userId]);
            const newBalance = parseFloat(update.rows[0].balance);
            await client.query(`INSERT INTO wallet_transactions (id, user_id, amount, type, reference_id, description, balance_after, status)
         VALUES ($1, $2, $3, $4, $5, $6, $7, 'completed')`, [uuidv4(), userId, amount, type, referenceId, description, newBalance]);
            await client.query('COMMIT');
            return newBalance;
        }
        catch (err) {
            await client.query('ROLLBACK');
            throw err;
        }
        finally {
            client.release();
        }
    }
    static async debit(userId, amount, type, referenceId, description) {
        if (amount <= 0)
            throw new Error('Amount must be positive');
        const client = await db.connect();
        try {
            await client.query('BEGIN');
            const current = await this.getBalance(userId);
            if (current < amount)
                throw new Error('Insufficient balance');
            const update = await client.query('UPDATE users SET balance = balance - $1 WHERE id = $2 RETURNING balance', [amount, userId]);
            const newBalance = parseFloat(update.rows[0].balance);
            await client.query(`INSERT INTO wallet_transactions (id, user_id, amount, type, reference_id, description, balance_after, status)
         VALUES ($1, $2, $3, $4, $5, $6, $7, 'completed')`, [uuidv4(), userId, amount, type, referenceId, description, newBalance]);
            await client.query('COMMIT');
            return newBalance;
        }
        catch (err) {
            await client.query('ROLLBACK');
            throw err;
        }
        finally {
            client.release();
        }
    }
    static async freeze(userId, amount, description = 'Freeze') {
        // Placeholder for future implementation
        return { success: true };
    }
    static async release(userId, amount, description = 'Release') {
        // Placeholder for future implementation
        return { success: true };
    }
    static async refund(userId, amount, orderId, description) {
        return this.credit(userId, amount, 'refund', orderId, description);
    }
}
//# sourceMappingURL=wallet.service.js.map