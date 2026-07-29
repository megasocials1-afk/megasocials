import { db } from '../db/pool.js';
export class WalletService {
    static async getBalance(userId) {
        const res = await db.query('SELECT balance FROM users WHERE id = $1', [userId]);
        return parseFloat(res.rows[0]?.balance || '0');
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
         VALUES (gen_random_uuid(), $1, $2, $3, $4, $5, $6, 'completed')`, [userId, amount, type, referenceId, description, newBalance]);
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
         VALUES (gen_random_uuid(), $1, $2, $3, $4, $5, $6, 'completed')`, [userId, amount, type, referenceId, description, newBalance]);
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
}
