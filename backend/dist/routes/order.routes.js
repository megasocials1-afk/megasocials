import { db } from '../db/pool.js';
import { OrderService } from '../services/order.service.js';
export default {
    createOrder: async (req, res) => {
        try {
            const userId = req.user?.id || req.body.userId;
            const { serviceId, link, quantity, promoCode } = req.body;
            const order = await OrderService.createOrder(userId, serviceId, link, quantity, promoCode);
            res.json(order);
        }
        catch (err) {
            res.status(400).json({ error: err.message });
        }
    },
    getOrders: async (req, res) => {
        try {
            const userId = req.user?.id || req.query.userId;
            const result = await db.query('SELECT * FROM orders WHERE user_id = $1 ORDER BY created_at DESC', [userId]);
            res.json(result.rows);
        }
        catch {
            res.status(400).json({ error: 'Failed to get orders' });
        }
    },
    getOrder: async (req, res) => {
        try {
            const { id } = req.params;
            const userId = req.user?.id || req.query.userId;
            const result = await db.query('SELECT * FROM orders WHERE id = $1 AND user_id = $2', [id, userId]);
            if (!result.rows.length)
                return res.status(404).json({ error: 'Order not found' });
            res.json(result.rows[0]);
        }
        catch {
            res.status(400).json({ error: 'Failed to get order' });
        }
    }
};
