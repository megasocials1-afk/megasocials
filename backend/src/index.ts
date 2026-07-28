import express from 'express';
import cors from 'cors';
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
app.use(cors());
app.use(express.json());

// Health check
app.get('/api/health', (req, res) => {
  res.json({ ok: true, timestamp: new Date().toISOString() });
});

// Auth routes
app.post('/api/auth/login', authRoutes.login);
app.post('/api/auth/register', authRoutes.register);
app.post('/api/auth/forgot-password', authRoutes.forgotPassword);
app.post('/api/auth/reset-password', authRoutes.resetPassword);
app.get('/api/auth/verify-email', authRoutes.verifyEmail);

// User profile
app.get('/api/profile', userRoutes.getProfile);
app.put('/api/profile', userRoutes.updateProfile);

// Wallet
app.get('/api/wallet/balance', walletRoutes.getBalance);
app.get('/api/wallet/transactions', walletRoutes.getTransactions);

// Orders
app.post('/api/orders', orderRoutes.createOrder);
app.get('/api/orders', orderRoutes.getOrders);
app.get('/api/orders/:id', orderRoutes.getOrder);

// Services
app.get('/api/services', serviceRoutes.listServices);
app.get('/api/services/:id', serviceRoutes.getService);

// Admin endpoints (with auth & RBAC to be added later)
app.get('/api/admin/users', adminRoutes.getUsers);
app.put('/api/admin/users/:id', adminRoutes.updateUser);
app.post('/api/admin/users/:id/suspend', adminRoutes.suspendUser);
app.get('/api/admin/users/:id/permissions', adminRoutes.getAdminPermissions);
app.put('/api/admin/users/:id/permissions', adminRoutes.updateAdminPermissions);
app.get('/api/admin/providers', adminRoutes.getProviders);
app.post('/api/admin/providers', adminRoutes.createProvider);
app.put('/api/admin/providers/:id', adminRoutes.updateProvider);
app.post('/api/admin/services/sync', adminRoutes.syncServices);
app.get('/api/admin/orders', adminRoutes.getAllOrders);
app.put('/api/admin/orders/:id/status', adminRoutes.updateOrderStatus);
app.get('/api/admin/settings', adminRoutes.getSettings);
app.put('/api/admin/settings', adminRoutes.updateSetting);
app.get('/api/admin/logs', adminRoutes.getActivityLogs);
app.get('/api/admin/dashboard', adminRoutes.getDashboardStats);

// Deposit routes
app.post('/api/deposits', depositRoutes.createDeposit);
app.get('/api/deposits', depositRoutes.getDeposits);
app.post('/api/webhooks/flutterwave', depositRoutes.webhook);

const PORT = process.env.PORT || 10000;
app.listen(PORT, () => {
  console.log(`✅ Server running on port ${PORT}`);
});
