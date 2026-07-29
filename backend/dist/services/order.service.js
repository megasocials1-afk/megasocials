import { db, query } from '../db/pool.js';
import { WalletService } from './wallet.service.js';
import { ServiceService } from './service.service.js';
import { ProviderService } from './provider.service.js';
import { v4 as uuidv4 } from 'uuid';
export class OrderService {
    static async createOrder(userId, serviceId, link, quantity, promoCode) {
        const client = await db.connect();
        try {
            await client.query('BEGIN');
            const service = await ServiceService.getService(serviceId);
            if (!service || service.status !== 'active') {
                throw new Error('Service unavailable');
            }
            if (quantity < service.min || quantity > service.max) {
                throw new Error(`Quantity must be between ${service.min} and ${service.max}`);
            }
            let price = service.cost * quantity;
            let discount = 0;
            if (promoCode) {
                const promoRes = await client.query(`SELECT * FROM promo_codes WHERE code = $1 AND status = 'active' AND (expires_at IS NULL OR expires_at > NOW())`, [promoCode]);
                const promo = promoRes.rows[0];
                if (promo) {
                    if (promo.usage_limit && promo.used_count >= promo.usage_limit) {
                        throw new Error('Promo code usage limit exceeded');
                    }
                    if (price < promo.min_order_amount) {
                        throw new Error(`Minimum order amount for this promo is ₦${promo.min_order_amount}`);
                    }
                    discount = promo.discount_type === 'percentage'
                        ? (price * promo.discount_value / 100)
                        : promo.discount_value;
                    if (promo.max_discount && discount > promo.max_discount) {
                        discount = promo.max_discount;
                    }
                    price = Math.max(0, price - discount);
                    await client.query('UPDATE promo_codes SET used_count = used_count + 1 WHERE id = $1', [promo.id]);
                }
            }
            const balance = await WalletService.getBalance(userId);
            if (balance < price) {
                throw new Error('Insufficient wallet balance');
            }
            await WalletService.debit(userId, price, 'order_debit', null, `Order for ${service.name}`);
            const adapter = await ProviderService.getAdapter(service.provider_id);
            let providerOrder;
            let providerSuccess = false;
            try {
                providerOrder = await adapter.createOrder(service.provider_service_id, link, quantity);
                providerSuccess = true;
            }
            catch (providerErr) {
                console.error('Provider error:', providerErr.message);
                const orderId = uuidv4();
                await client.query(`INSERT INTO orders (id, user_id, service_id, quantity, link, price, cost, profit, status, provider_response, created_at, updated_at)
           VALUES ($1, $2, $3, $4, $5, $6, $7, $8, 'pending', $9, NOW(), NOW())`, [orderId, userId, serviceId, quantity, link, price, service.cost * quantity, price - (service.cost * quantity), {
                        error: providerErr.message,
                        pending_reason: 'provider_insufficient'
                    }]);
                await client.query('COMMIT');
                return {
                    id: orderId,
                    status: 'pending',
                    message: 'Order placed – provider balance is low. It will be processed once funds are added.',
                    wallet_debited: true,
                    amount: price
                };
            }
            const orderId = uuidv4();
            await client.query(`INSERT INTO orders (id, user_id, service_id, provider_order_id, quantity, link, price, cost, profit, status, created_at, updated_at)
         VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, 'pending', NOW(), NOW())`, [orderId, userId, serviceId, providerOrder.orderId, quantity, link, price, service.cost * quantity, price - (service.cost * quantity)]);
            await client.query('COMMIT');
            return {
                id: orderId,
                status: 'pending',
                message: 'Order placed successfully'
            };
        }
        catch (err) {
            await client.query('ROLLBACK');
            throw err;
        }
        finally {
            client.release();
        }
    }
    static async syncOrderStatus(orderId) {
        const orderRes = await query('SELECT * FROM orders WHERE id = $1', [orderId]);
        const order = orderRes.rows[0];
        if (!order)
            return;
        const service = await ServiceService.getService(order.service_id);
        const adapter = await ProviderService.getAdapter(service.provider_id);
        const statusData = await adapter.getOrderStatus(order.provider_order_id);
        const newStatus = this.mapProviderStatus(statusData.status);
        await query(`UPDATE orders SET status = $1, start_count = $2, current_count = $3, remains = $4, updated_at = NOW()
       WHERE id = $5`, [newStatus, statusData.startCount, statusData.currentCount, statusData.remains, orderId]);
        if (newStatus === 'partial' && order.status !== 'partial') {
            const completed = statusData.currentCount || 0;
            const refundAmount = (order.quantity - completed) * order.cost;
            if (refundAmount > 0) {
                await WalletService.credit(order.user_id, refundAmount, 'refund', orderId, `Partial refund for order ${orderId}`);
            }
        }
        else if (newStatus === 'canceled' && order.status !== 'canceled') {
            await WalletService.credit(order.user_id, order.price, 'refund', orderId, `Order canceled - refund`);
        }
    }
    static async retryPendingOrders() {
        const res = await query(`SELECT id, user_id, service_id, quantity, link, price FROM orders
       WHERE status = 'pending' AND provider_response->>'pending_reason' = 'provider_insufficient'`);
        for (const order of res.rows) {
            try {
                const service = await ServiceService.getService(order.service_id);
                const adapter = await ProviderService.getAdapter(service.provider_id);
                const providerOrder = await adapter.createOrder(service.provider_service_id, order.link, order.quantity);
                await query(`UPDATE orders SET provider_order_id = $1, provider_response = NULL, updated_at = NOW() WHERE id = $2`, [providerOrder.orderId, order.id]);
                console.log(`[RetryPending] Order ${order.id} retried successfully`);
            }
            catch (err) {
                console.log(`[RetryPending] Order ${order.id} retry failed:`, err.message);
            }
        }
    }
    static async getOrder(orderId, userId) {
        const res = await query('SELECT * FROM orders WHERE id = $1 AND user_id = $2', [orderId, userId]);
        return res.rows[0] || null;
    }
    static async getUserOrders(userId, limit = 50, offset = 0) {
        const res = await query('SELECT * FROM orders WHERE user_id = $1 ORDER BY created_at DESC LIMIT $2 OFFSET $3', [userId, limit, offset]);
        return res.rows;
    }
    static async getAllOrders(limit = 50, offset = 0) {
        const res = await query(`SELECT o.*, u.email, u.username FROM orders o
       JOIN users u ON o.user_id = u.id
       ORDER BY o.created_at DESC LIMIT $1 OFFSET $2`, [limit, offset]);
        return res.rows;
    }
    static async updateStatus(orderId, status) {
        await query('UPDATE orders SET status = $1, updated_at = NOW() WHERE id = $2', [status, orderId]);
        return { success: true };
    }
    static mapProviderStatus(providerStatus) {
        const map = {
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
//# sourceMappingURL=order.service.js.map