import { ServiceService } from '../services/service.service.js';

export default {
  listServices: async (req: any, res: any) => {
    try {
      const services = await ServiceService.listServices();
      res.json(services);
    } catch (err) {
      res.status(400).json({ error: 'Failed to get services' });
    }
  },
  getService: async (req: any, res: any) => {
    try {
      const { id } = req.params;
      const service = await ServiceService.getService(id);
      if (!service) return res.status(404).json({ error: 'Service not found' });
      res.json(service);
    } catch (err) {
      res.status(400).json({ error: 'Failed to get service' });
    }
  },
  syncServices: async (req: any, res: any) => {
    try {
      const { providerId } = req.body;
      if (!providerId) return res.status(400).json({ error: 'providerId required' });
      const result = await ServiceService.syncServices(providerId);
      res.json(result);
    } catch (err: any) {
      res.status(400).json({ error: err.message });
    }
  },
  updateMargin: async (req: any, res: any) => {
    try {
      const { id } = req.params;
      const { margin_percent, margin_fixed } = req.body;
      await ServiceService.updateMargin(id, margin_percent, margin_fixed);
      res.json({ success: true });
    } catch (err: any) {
      res.status(400).json({ error: err.message });
    }
  },
};
