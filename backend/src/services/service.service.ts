import { query } from '../db/pool.js';
import { ProviderService } from './provider.service.js';
import { v4 as uuidv4 } from 'uuid';

export class ServiceService {
  static async getService(serviceId: string) {
    const res = await query('SELECT * FROM services WHERE id = $1', [serviceId]);
    return res.rows[0];
  }

  static async listServices(status: string = 'active') {
    const res = await query('SELECT * FROM services WHERE status = $1 ORDER BY name', [status]);
    return res.rows;
  }

  static async syncServices(providerId: string) {
    const adapter = await ProviderService.getAdapter(providerId);
    const providerServices = await adapter.getServices();
    const marginRes = await query("SELECT value FROM settings WHERE key = 'global_margin_percent'");
    const globalMargin = parseFloat(marginRes.rows[0]?.value || '20');
    for (const ps of providerServices) {
      const existing = await query(
        'SELECT id FROM services WHERE provider_id = $1 AND provider_service_id = $2',
        [providerId, ps.id]
      );
      const cost = ps.rate * (1 + globalMargin / 100);
      const categoryId = await this.ensureCategory(ps.category);
      if (existing.rows.length) {
        await query(
          `UPDATE services SET
            name = $1, description = $2, min = $3, max = $4, rate = $5,
            cost = $6, profit = $7, provider_service_category = $8, updated_at = NOW()
          WHERE id = $9`,
          [ps.name, ps.description, ps.min, ps.max, ps.rate, cost, cost - ps.rate, ps.category, existing.rows[0].id]
        );
      } else {
        await query(
          `INSERT INTO services (id, provider_id, provider_service_id, category_id, name, description, min, max, rate, cost, profit, provider_service_category)
           VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11)`,
          [uuidv4(), providerId, ps.id, categoryId, ps.name, ps.description, ps.min, ps.max, ps.rate, cost, cost - ps.rate, ps.category]
        );
      }
    }
    await query('UPDATE providers SET updated_at = NOW() WHERE id = $1', [providerId]);
    return { success: true, count: providerServices.length };
  }

  private static async ensureCategory(categoryName: string) {
    if (!categoryName) return null;
    const res = await query('SELECT id FROM categories WHERE name = $1', [categoryName]);
    if (res.rows.length) return res.rows[0].id;
    const insert = await query(
      'INSERT INTO categories (id, name) VALUES ($1, $2) RETURNING id',
      [uuidv4(), categoryName]
    );
    return insert.rows[0].id;
  }

  static async updateMargin(serviceId: string, marginPercent?: number, marginFixed?: number) {
    const updates: string[] = [];
    const values: any[] = [];
    let paramIndex = 1;
    if (marginPercent !== undefined) {
      updates.push(`margin_percent = $${paramIndex++}`);
      values.push(marginPercent);
    }
    if (marginFixed !== undefined) {
      updates.push(`margin_fixed = $${paramIndex++}`);
      values.push(marginFixed);
    }
    if (!updates.length) throw new Error('No fields to update');
    values.push(serviceId);
    await query(
      `UPDATE services SET ${updates.join(', ')}, updated_at = NOW() WHERE id = $${paramIndex}`,
      values
    );
    return { success: true };
  }
}
