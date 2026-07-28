export default {
  getUsers: async (req: any, res: any) => res.json([]),
  updateUser: async (req: any, res: any) => res.json({ success: true }),
  suspendUser: async (req: any, res: any) => res.json({ success: true }),
  getAdminPermissions: async (req: any, res: any) => res.json({ permissions: [] }),
  updateAdminPermissions: async (req: any, res: any) => res.json({ success: true }),
  getProviders: async (req: any, res: any) => res.json([]),
  createProvider: async (req: any, res: any) => res.json({ success: true }),
  updateProvider: async (req: any, res: any) => res.json({ success: true }),
  syncServices: async (req: any, res: any) => res.json({ success: true }),
  getAllOrders: async (req: any, res: any) => res.json([]),
  updateOrderStatus: async (req: any, res: any) => res.json({ success: true }),
  getSettings: async (req: any, res: any) => res.json({}),
  updateSetting: async (req: any, res: any) => res.json({ success: true }),
  getActivityLogs: async (req: any, res: any) => res.json([]),
  getDashboardStats: async (req: any, res: any) => res.json({ totalUsers: 0, totalOrders: 0 })
};
