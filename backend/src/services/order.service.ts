import { db } from '../db/pool.js';
import { WalletService } from './wallet.service.js';
import { ServiceService } from './service.service.js';
import { ProviderService } from './provider.service.js';
import { v4 as uuidv4 } from 'uuid';

export class OrderService {
  static async createOrder(userId: string, serviceId: string, link: string, quantity: number, promoCode?: string) {
    const client = await db.connect();
    try {
      await client.query('BEGIN');
      const service = await ServiceService.getService(serviceId);
      if (!service || service.status !== 'active') throw new Error('Service unavailable');
      if (quantity < service.min || quantity > service.max) {
        throw new Error(`Quantity must be between ${service.min} and ${service.max}`);
      }
      let price = service.cost * quantity;
      if (promoCode) {
        const promoRes = await db.query(
          `SELECT * FROM promo_codes WHERE code = $1 AND status = 'active' AND (expires_at IS NULL OR expires_at > NOW())`,
          [promoCode]
        );
        const promo = promoRes.rows[0];
        if (promo) {
          if (promo.usage_limit && promo.used_count >= promo.usage_limit) throw new Error('Promo expired');
          if (price < promo.min_order_amount) throw new Error('Minimum order not met');
          let discount = promo.discount_type === 'percentage' ? (price * promo.discount_value / 100) : promo.discount_value;
          if (promo.max_discount && discount > promo.max_discount) discount = promo.max_discount;
          price = Math.max(0, price - discount);
          await db.query('UPDATE promo_codes SET used_count = used_count + 1 WHERE id = $1', [promo.id]);
        }
      }
      const balance = await WalletService.getBalance(userId);
      if (balance < price) throw new Error('Insufficient wallet balance');
      await WalletService.debit(userId, price, 'order_debit', null, 'Order for ' + service.name);

      const adapter = await ProviderService.getAdapter(service.provider_id);
      const providerOrder = await adapter.createOrder(service.provider_service_id, link, quantity);
      const orderId = uuidv4();
      await client.query(
        `INSERT INTO orders (id, user_id, service_id, provider_order_id, quantity, link, price, cost, profit, status, created_at, updated_at)
         VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, 'pending', NOW(), NOW())`,
        [orderId, userId, serviceId, providerOrder.orderId, quantity, link, price, service.cost * quantity, price - (service.cost * quantity)]
      );
      await client.query('COMMIT');
      return { id: orderId };
    } catch (err) {
      await client.query('ROLLBACK');
      throw err;
    } finally {
      client.release();
    }
  }

  static async syncOrderStatus(orderId: string) {
    const orderRes = await db.query('SELECT * FROM orders WHERE id = $1', [orderId]);
    const order = orderRes.rows[0];
    if (!order) return;
    const service = await ServiceService.getService(order.service_id);
    const adapter = await ProviderService.getAdapter(service.provider_id);
    const statusData = await adapter.getOrderStatus(order.provider_order_id);
    const newStatus = this.mapProviderStatus(statusData.status);
    await db.query(
      `UPDATE orders SET status = $1, start_count = $2, current_count = $3, remains = $4, updated_at = NOW() WHERE id = $5`,
      [newStatus, statusData.startCount, statusData.currentCount, statusData.remains, orderId]
    );
    if (newStatus === 'partial' && order.status !== 'partial') {
      const completed = statusData.currentCount || 0;
      const refundAmount = (order.quantity - completed) * order.cost;
      if (refundAmount > 0) {
        await WalletService.credit(order.user_id, refundAmount, 'refund', orderId, 'Partial refund for order ' + orderId);
      }
    } else if (newStatus === 'canceled' && order.status !== 'canceled') {
      await WalletService.credit(order.user_id, order.price, 'refund', orderId, 'Order canceled - refund');
    }
  }

  private static mapProviderStatus(providerStatus: string): string {
    const map: Record<string, string> = {
      'pending': 'pending',
      'processing': 'processing',
      'inprogress': 'in_progress',
      'completed': 'completed',
      'partial': 'partial',
      'canceled': 'canceled',
    };
    return map[providerStatus] || 'pending';
  }
}
