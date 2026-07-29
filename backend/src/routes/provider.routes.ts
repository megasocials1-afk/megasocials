import { ProviderService } from '../services/provider.service.js';

export default {
  list: async (req: any, res: any) => {
    try {
      const providers = await ProviderService.listProviders();
      res.json(providers);
    } catch (err) {
      res.status(400).json({ error: 'Failed to get providers' });
    }
  },
  create: async (req: any, res: any) => {
    try {
      const provider = await ProviderService.createProvider(req.body);
      res.json(provider);
    } catch (err: any) {
      res.status(400).json({ error: err.message });
    }
  },
  update: async (req: any, res: any) => {
    try {
      const { id } = req.params;
      await ProviderService.updateProvider(id, req.body);
      res.json({ success: true });
    } catch (err: any) {
      res.status(400).json({ error: err.message });
    }
  },
  delete: async (req: any, res: any) => {
    try {
      const { id } = req.params;
      await ProviderService.deleteProvider(id);
      res.json({ success: true });
    } catch (err: any) {
      res.status(400).json({ error: err.message });
    }
  },
};
