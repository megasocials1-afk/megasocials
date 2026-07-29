import { query } from '../db/pool.js';
import { ProviderFactory } from '../providers/provider.factory.js';
import { v4 as uuidv4 } from 'uuid';
export class ProviderService {
    static async getProvider(providerId) {
        const res = await query('SELECT * FROM providers WHERE id = $1', [providerId]);
        return res.rows[0];
    }
    static async getAdapter(providerId) {
        const provider = await this.getProvider(providerId);
        if (!provider)
            throw new Error('Provider not found');
        return ProviderFactory.createAdapter(provider.type, provider.api_url, provider.api_key, provider.config);
    }
    static async listProviders() {
        const res = await query('SELECT * FROM providers ORDER BY created_at DESC');
        return res.rows;
    }
    static async createProvider(data) {
        const res = await query(`INSERT INTO providers (id, name, api_url, api_key, api_secret, type, config, status)
       VALUES ($1, $2, $3, $4, $5, $6, $7, 'active') RETURNING *`, [uuidv4(), data.name, data.api_url, data.api_key || null, data.api_secret || null, data.type || 'smmrug', data.config || {}]);
        return res.rows[0];
    }
    static async updateProvider(providerId, data) {
        const updates = [];
        const values = [];
        let paramIndex = 1;
        for (const [key, value] of Object.entries(data)) {
            updates.push(`${key} = $${paramIndex++}`);
            values.push(value);
        }
        if (!updates.length)
            throw new Error('No fields to update');
        values.push(providerId);
        await query(`UPDATE providers SET ${updates.join(', ')}, updated_at = NOW() WHERE id = $${paramIndex}`, values);
        return { success: true };
    }
    static async deleteProvider(providerId) {
        await query('DELETE FROM providers WHERE id = $1', [providerId]);
        return { success: true };
    }
}
//# sourceMappingURL=provider.service.js.map