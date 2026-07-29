import { DepositService } from '../services/deposit.service.js';
export default {
    create: async (req, res) => {
        try {
            const userId = req.user.id;
            const { amount, method } = req.body;
            const deposit = await DepositService.createDeposit(userId, amount, method || 'manual');
            res.json(deposit);
        }
        catch (err) {
            res.status(400).json({ error: err.message });
        }
    },
    list: async (req, res) => {
        try {
            const userId = req.user.id;
            const deposits = await DepositService.getUserDeposits(userId);
            res.json(deposits);
        }
        catch (err) {
            res.status(400).json({ error: 'Failed to get deposits' });
        }
    },
    adminList: async (req, res) => {
        try {
            const deposits = await DepositService.getAllDeposits();
            res.json(deposits);
        }
        catch (err) {
            res.status(400).json({ error: 'Failed to get deposits' });
        }
    },
    approve: async (req, res) => {
        try {
            const { id } = req.params;
            const adminId = req.user.id;
            const deposit = await DepositService.approveDeposit(id, adminId);
            res.json(deposit);
        }
        catch (err) {
            res.status(400).json({ error: err.message });
        }
    },
    reject: async (req, res) => {
        try {
            const { id } = req.params;
            const { reason } = req.body;
            await DepositService.rejectDeposit(id, reason);
            res.json({ success: true });
        }
        catch (err) {
            res.status(400).json({ error: err.message });
        }
    },
};
//# sourceMappingURL=deposit.routes.js.map