import cron from 'node-cron';
import { ServiceService } from '../services/service.service.js';
import { OrderService } from '../services/order.service.js';
import { db } from '../db/pool.js';

cron.schedule('*/5 * * * *', async () => {
  console.log('[OrderSync] Running...');
  const res = await db.query("SELECT id FROM orders WHERE status IN ('pending','processing','in_progress')");
  for (const row of res.rows) {
    try {
      await OrderService.syncOrderStatus(row.id);
    } catch (err) {
      console.error('[OrderSync] Error on', row.id, err);
    }
  }
});
