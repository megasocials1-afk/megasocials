import { query } from '../db/pool.js';

export class SettingsService {
  static async getAll() {
    const result = await query('SELECT * FROM settings');
    return result.rows;
  }

  static async get(key: string) {
    const result = await query('SELECT value FROM settings WHERE key = $1', [key]);
    return result.rows[0]?.value;
  }

  static async set(key: string, value: any) {
    await query(
      `INSERT INTO settings (key, value) VALUES ($1, $2)
       ON CONFLICT (key) DO UPDATE SET value = $2, updated_at = NOW()`,
      [key, value]
    );
    return { success: true };
  }
}
