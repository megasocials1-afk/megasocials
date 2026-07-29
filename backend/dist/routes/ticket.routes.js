import { TicketService } from '../services/ticket.service.js';
export default {
    create: async (req, res) => {
        try {
            const userId = req.user.id;
            const { subject, message, priority } = req.body;
            const ticket = await TicketService.createTicket(userId, subject, message, priority);
            res.json(ticket);
        }
        catch (err) {
            res.status(400).json({ error: err.message });
        }
    },
    list: async (req, res) => {
        try {
            const userId = req.user.id;
            const tickets = await TicketService.getUserTickets(userId);
            res.json(tickets);
        }
        catch (err) {
            res.status(400).json({ error: 'Failed to get tickets' });
        }
    },
    get: async (req, res) => {
        try {
            const { id } = req.params;
            const userId = req.user.id;
            const ticket = await TicketService.getTicket(id, userId);
            if (!ticket)
                return res.status(404).json({ error: 'Ticket not found' });
            res.json(ticket);
        }
        catch (err) {
            res.status(400).json({ error: 'Failed to get ticket' });
        }
    },
    reply: async (req, res) => {
        try {
            const { id } = req.params;
            const userId = req.user.id;
            const { message } = req.body;
            const reply = await TicketService.addReply(id, userId, message, req.user.role === 'admin' || req.user.role === 'super_admin');
            res.json(reply);
        }
        catch (err) {
            res.status(400).json({ error: err.message });
        }
    },
    adminList: async (req, res) => {
        try {
            const tickets = await TicketService.getAllTickets();
            res.json(tickets);
        }
        catch (err) {
            res.status(400).json({ error: 'Failed to get tickets' });
        }
    },
    adminUpdateStatus: async (req, res) => {
        try {
            const { id } = req.params;
            const { status } = req.body;
            await TicketService.updateStatus(id, status);
            res.json({ success: true });
        }
        catch (err) {
            res.status(400).json({ error: err.message });
        }
    },
};
//# sourceMappingURL=ticket.routes.js.map