import { ServiceService } from "../services/service.service.js";

import cron from 'node-cron';
import { OrderService } from '../services/order.service.js';
import { db } from '../db/pool.js';
import { ActivityLogService } from '../services/activity-log.service.js';

export const startOrderSync = () => {
  cron.schedule('*/5 * * * *', async () => {
    console.log('[OrderSync] Running...');
    try {
      const res = await db.query("SELECT id FROM orders WHERE status IN ('pending','processing','in_progress')");
      for (const row of res.rows) {
        try {
          await OrderService.syncOrderStatus(row.id);
        } catch (err) {
          console.error('[OrderSync] Error on', row.id, ':', err);
        }
      }
    } catch (err) {
      console.error('[OrderSync] Fatal error:', err);
    }
  });
};

export const startRetryPending = () => {
  cron.schedule('*/5 * * * *', async () => {
    console.log('[RetryPending] Checking for pending orders with insufficient provider balance...');
    try {
      await OrderService.retryPendingOrders();
    } catch (err) {
      console.error('[RetryPending] Error:', err);
    }
  });
};

export const startServiceSync = () => {
  cron.schedule('0 */6 * * *', async () => {
    console.log('[ServiceSync] Running...');
    try {
      const providers = await db.query("SELECT id FROM providers WHERE status = 'active'");
      for (const p of providers.rows) {
        try {
          await ServiceService.syncServices(p.id);
        } catch (err) {
          console.error('[ServiceSync] Error on provider', p.id, ':', err);
        }
      }
    } catch (err) {
      console.error('[ServiceSync] Fatal error:', err);
    }
  });
};
