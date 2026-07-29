import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { DashboardLayout } from './components/layout/DashboardLayout';
import { Dashboard } from './components/dashboard/Dashboard';
import { Login } from './components/auth/Login';
import { Register } from './components/auth/Register';
import { VerifyEmail } from './components/auth/VerifyEmail';
import { ForgotPassword } from './components/auth/ForgotPassword';
import { ProtectedRoute } from './components/common/ProtectedRoute';
import { UsersAdmin } from './components/admin/UsersAdmin';
import { SettingsAdmin } from './components/admin/SettingsAdmin';
import { ServiceList } from './components/services/ServiceList';
import { Deposit } from './components/wallet/Deposit';
import { OrdersList } from './components/orders/OrdersList';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

function App() {
  return (
    <BrowserRouter>
      <ToastContainer position="bottom-right" theme="dark" />
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/verify" element={<VerifyEmail />} />
        <Route path="/forgot-password" element={<ForgotPassword />} />
        <Route path="/" element={<Navigate to="/dashboard" />} />
        <Route element={<ProtectedRoute />}>
          <Route element={<DashboardLayout />}>
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/orders" element={<OrdersList />} />
            <Route path="/services" element={<ServiceList />} />
            <Route path="/wallet" element={<Deposit />} />
            <Route path="/transactions" element={<div className="text-white p-4">Transactions</div>} />
            <Route path="/referrals" element={<div className="text-white p-4">Referrals</div>} />
            <Route path="/tickets" element={<div className="text-white p-4">Tickets</div>} />
            <Route path="/api" element={<div className="text-white p-4">API Keys</div>} />
            <Route path="/account" element={<div className="text-white p-4">Account Settings</div>} />
            <Route path="/admin/users" element={<UsersAdmin />} />
            <Route path="/admin/settings" element={<SettingsAdmin />} />
          </Route>
        </Route>
      </Routes>
    </BrowserRouter>
  );
}
export default App;
