import { db } from '../db/pool.js';
import { ProviderService } from './provider.service.js';
export class ServiceService {
    static async getService(serviceId) {
        const res = await db.query('SELECT * FROM services WHERE id = $1', [serviceId]);
        return res.rows[0];
    }
    static async syncServices(providerId) {
        const adapter = await ProviderService.getAdapter(providerId);
        const providerServices = await adapter.getServices();
        const marginRes = await db.query("SELECT value FROM settings WHERE key = 'global_margin_percent'");
        const globalMargin = parseFloat(marginRes.rows[0]?.value || '20');
        for (const ps of providerServices) {
            const existing = await db.query('SELECT id FROM services WHERE provider_id = $1 AND provider_service_id = $2', [providerId, ps.id]);
            const cost = ps.rate * (1 + globalMargin / 100);
            const categoryId = await this.ensureCategory(ps.category);
            if (existing.rows.length) {
                await db.query(`UPDATE services SET name = $1, description = $2, min = $3, max = $4, rate = $5, cost = $6, profit = $7, provider_service_category = $8, updated_at = NOW() WHERE id = $9`, [ps.name, ps.description, ps.min, ps.max, ps.rate, cost, cost - ps.rate, ps.category, existing.rows[0].id]);
            }
            else {
                await db.query(`INSERT INTO services (id, provider_id, provider_service_id, category_id, name, description, min, max, rate, cost, profit, provider_service_category)
           VALUES (gen_random_uuid(), $1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11)`, [providerId, ps.id, categoryId, ps.name, ps.description, ps.min, ps.max, ps.rate, cost, cost - ps.rate, ps.category]);
            }
        }
        await db.query('UPDATE providers SET updated_at = NOW() WHERE id = $1', [providerId]);
    }
    static async ensureCategory(categoryName) {
        if (!categoryName)
            return null;
        const res = await db.query('SELECT id FROM categories WHERE name = $1', [categoryName]);
        if (res.rows.length)
            return res.rows[0].id;
        const insert = await db.query('INSERT INTO categories (id, name) VALUES (gen_random_uuid(), $1) RETURNING id', [categoryName]);
        return insert.rows[0].id;
    }
}
