import { OrderService } from '../services/order.service.js';
import { authMiddleware } from '../middleware/auth.js';
import { rbac } from '../middleware/rbac.js';

export default {
  createOrder: async (req: any, res: any) => {
    try {
      const userId = req.user.id;
      const { serviceId, link, quantity, promoCode } = req.body;
      const order = await OrderService.createOrder(userId, serviceId, link, quantity, promoCode);
      res.json(order);
    } catch (err: any) {
      res.status(400).json({ error: err.message });
    }
  },
  getOrders: async (req: any, res: any) => {
    try {
      const userId = req.user.id;
      const { limit = 50, offset = 0 } = req.query;
      const orders = await OrderService.getUserOrders(userId, parseInt(limit), parseInt(offset));
      res.json(orders);
    } catch (err) {
      res.status(400).json({ error: 'Failed to get orders' });
    }
  },
  getOrder: async (req: any, res: any) => {
    try {
      const { id } = req.params;
      const userId = req.user.id;
      const order = await OrderService.getOrder(id, userId);
      if (!order) return res.status(404).json({ error: 'Order not found' });
      res.json(order);
    } catch (err) {
      res.status(400).json({ error: 'Failed to get order' });
    }
  },
  syncOrder: async (req: any, res: any) => {
    try {
      const { id } = req.params;
      await OrderService.syncOrderStatus(id);
      res.json({ success: true });
    } catch (err: any) {
      res.status(400).json({ error: err.message });
    }
  },
  adminGetAll: async (req: any, res: any) => {
    try {
      const { limit = 50, offset = 0 } = req.query;
      const orders = await OrderService.getAllOrders(parseInt(limit), parseInt(offset));
      res.json(orders);
    } catch (err) {
      res.status(400).json({ error: 'Failed to get orders' });
    }
  },
  adminUpdateStatus: async (req: any, res: any) => {
    try {
      const { id } = req.params;
      const { status } = req.body;
      await OrderService.updateStatus(id, status);
      res.json({ success: true });
    } catch (err: any) {
      res.status(400).json({ error: err.message });
    }
  },
  retryPending: async (req: any, res: any) => {
    try {
      await OrderService.retryPendingOrders();
      res.json({ success: true, message: 'Pending orders retry initiated' });
    } catch (err: any) {
      res.status(400).json({ error: err.message });
    }
  },
};
