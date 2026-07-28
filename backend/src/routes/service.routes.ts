import { db } from '../db/pool.js';

export default {
  listServices: async (req: any, res: any) => {
    try {
      const result = await db.query("SELECT * FROM services WHERE status = 'active'");
      res.json(result.rows);
    } catch {
      res.status(400).json({ error: 'Failed to get services' });
    }
  },
  getService: async (req: any, res: any) => {
    try {
      const { id } = req.params;
      const result = await db.query('SELECT * FROM services WHERE id = $1', [id]);
      if (!result.rows.length) return res.status(404).json({ error: 'Service not found' });
      res.json(result.rows[0]);
    } catch {
      res.status(400).json({ error: 'Failed to get service' });
    }
  }
};
