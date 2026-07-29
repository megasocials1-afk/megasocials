import { db } from '../db/pool.js';
import { ProviderFactory } from '../providers/provider.factory.js';
export class ProviderService {
    static async getProvider(providerId) {
        const res = await db.query('SELECT * FROM providers WHERE id = $1', [providerId]);
        return res.rows[0];
    }
    static async getAdapter(providerId) {
        const provider = await this.getProvider(providerId);
        if (!provider)
            throw new Error('Provider not found');
        return ProviderFactory.createAdapter(provider.type, provider.api_url, provider.api_key, provider.config);
    }
}
