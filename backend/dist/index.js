import express from 'express';
import cors from 'cors';
import { db } from './db/pool.js';
import { authMiddleware } from './middleware/auth.js';
import { rbac } from './middleware/rbac.js';
import { rateLimit } from './middleware/rateLimit.js';
import authRoutes from './routes/auth.routes.js';
import userRoutes from './routes/user.routes.js';
import walletRoutes from './routes/wallet.routes.js';
import orderRoutes from './routes/order.routes.js';
import serviceRoutes from './routes/service.routes.js';
import providerRoutes from './routes/provider.routes.js';
import ticketRoutes from './routes/ticket.routes.js';
import depositRoutes from './routes/deposit.routes.js';
import adminRoutes from './routes/admin.routes.js';
const app = express();
const PORT = process.env.PORT || 10000;
// Middleware
app.use(cors({
    origin: process.env.FRONTEND_URL || '*',
    credentials: true,
}));
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));
// Rate limiting (global)
app.use(rateLimit(100));
// Health checks
app.get('/api/health', (req, res) => {
    res.json({ ok: true, timestamp: new Date().toISOString() });
});
app.get('/api/test-db', async (req, res) => {
    try {
        const result = await db.query('SELECT NOW()');
        res.json({ time: result.rows[0].now });
    }
    catch (err) {
        res.status(500).json({ error: err.message });
    }
});
// Auth routes (public)
app.post('/api/auth/login', authRoutes.login);
app.post('/api/auth/register', authRoutes.register);
app.post('/api/auth/forgot-password', authRoutes.forgotPassword);
app.post('/api/auth/reset-password', authRoutes.resetPassword);
app.post('/api/auth/verify-email', authRoutes.verifyEmail);
// Auth routes (authenticated)
app.get('/api/auth/me', authMiddleware, authRoutes.me);
app.post('/api/auth/change-password', authMiddleware, authRoutes.changePassword);
app.put('/api/auth/profile', authMiddleware, authRoutes.updateProfile);
// User routes
app.get('/api/profile', authMiddleware, userRoutes.getProfile);
app.put('/api/profile', authMiddleware, userRoutes.updateProfile);
app.get('/api/wallet/balance', authMiddleware, walletRoutes.getBalance);
app.get('/api/wallet/transactions', authMiddleware, walletRoutes.getTransactions);
// Order routes
app.post('/api/orders', authMiddleware, orderRoutes.createOrder);
app.get('/api/orders', authMiddleware, orderRoutes.getOrders);
app.get('/api/orders/:id', authMiddleware, orderRoutes.getOrder);
app.post('/api/orders/:id/sync', authMiddleware, orderRoutes.syncOrder);
// Service routes
app.get('/api/services', authMiddleware, serviceRoutes.listServices);
app.get('/api/services/:id', authMiddleware, serviceRoutes.getService);
// Admin routes (all require admin or super_admin)
const adminRouter = express.Router();
adminRouter.use(authMiddleware);
adminRouter.use(rbac(['admin', 'super_admin']));
adminRouter.get('/users', adminRoutes.getUsers);
adminRouter.get('/users/:id', adminRoutes.getUser);
adminRouter.put('/users/:id', adminRoutes.updateUser);
adminRouter.post('/users/:id/suspend', adminRoutes.suspendUser);
adminRouter.get('/users/:id/permissions', adminRoutes.getAdminPermissions);
adminRouter.put('/users/:id/permissions', adminRoutes.updateAdminPermissions);
adminRouter.get('/providers', adminRoutes.getProviders);
adminRouter.post('/providers', adminRoutes.createProvider);
adminRouter.put('/providers/:id', adminRoutes.updateProvider);
adminRouter.delete('/providers/:id', adminRoutes.deleteProvider);
adminRouter.post('/services/sync', adminRoutes.syncServices);
adminRouter.get('/orders', adminRoutes.getOrders);
adminRouter.put('/orders/:id/status', adminRoutes.updateOrderStatus);
adminRouter.get('/settings', adminRoutes.getSettings);
adminRouter.put('/settings', adminRoutes.updateSetting);
adminRouter.get('/logs', adminRoutes.getLogs);
adminRouter.get('/dashboard', adminRoutes.getDashboardStats);
// Mount admin routes
app.use('/api/admin', adminRouter);
// Deposit routes
app.post('/api/deposits', authMiddleware, depositRoutes.create);
app.get('/api/deposits', authMiddleware, depositRoutes.list);
app.get('/api/admin/deposits', authMiddleware, rbac(['admin', 'super_admin']), depositRoutes.adminList);
app.put('/api/admin/deposits/:id/approve', authMiddleware, rbac(['admin', 'super_admin']), depositRoutes.approve);
app.post('/api/admin/deposits/:id/reject', authMiddleware, rbac(['admin', 'super_admin']), depositRoutes.reject);
// Provider routes
app.get('/api/providers', authMiddleware, rbac(['admin', 'super_admin']), providerRoutes.list);
app.post('/api/providers', authMiddleware, rbac(['admin', 'super_admin']), providerRoutes.create);
app.put('/api/providers/:id', authMiddleware, rbac(['admin', 'super_admin']), providerRoutes.update);
app.delete('/api/providers/:id', authMiddleware, rbac(['admin', 'super_admin']), providerRoutes.delete);
// Ticket routes
app.post('/api/tickets', authMiddleware, ticketRoutes.create);
app.get('/api/tickets', authMiddleware, ticketRoutes.list);
app.get('/api/tickets/:id', authMiddleware, ticketRoutes.get);
app.post('/api/tickets/:id/reply', authMiddleware, ticketRoutes.reply);
app.get('/api/admin/tickets', authMiddleware, rbac(['admin', 'super_admin']), ticketRoutes.adminList);
app.put('/api/admin/tickets/:id/status', authMiddleware, rbac(['admin', 'super_admin']), ticketRoutes.adminUpdateStatus);
// Error handler
app.use((err, req, res, next) => {
    console.error('Unhandled error:', err);
    res.status(500).json({ error: 'Internal server error' });
});
// Start server
app.listen(PORT, () => {
    console.log(`✅ Mega Socials backend running on port ${PORT}`);
    console.log(`📊 Health check: http://localhost:${PORT}/api/health`);
});
// Graceful shutdown
process.on('SIGTERM', () => {
    console.log('SIGTERM received, closing server...');
    process.exit(0);
});
process.on('SIGINT', () => {
    console.log('SIGINT received, closing server...');
    process.exit(0);
});
//# sourceMappingURL=index.js.map