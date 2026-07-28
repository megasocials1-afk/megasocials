export default {
  getBalance: async (req: any, res: any) => res.json({ balance: 0 }),
  getTransactions: async (req: any, res: any) => res.json([])
};
