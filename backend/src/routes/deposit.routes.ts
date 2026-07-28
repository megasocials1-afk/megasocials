export default {
  createDeposit: async (req: any, res: any) => res.json({ message: 'Create deposit not implemented' }),
  getDeposits: async (req: any, res: any) => res.json([]),
  webhook: async (req: any, res: any) => res.json({ success: true })
};
