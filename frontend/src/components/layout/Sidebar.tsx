import { NavLink } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';
import {
  LayoutDashboard, ShoppingBag, Layers, Wallet, CreditCard, Gift,
  Ticket, Key, User, LogOut, Users, Settings, Sparkles, Menu, X
} from 'lucide-react';
import { useState } from 'react';

const navItems = [
  { path: '/dashboard', icon: LayoutDashboard, label: 'Dashboard', roles: ['user', 'admin', 'super_admin'] },
  { path: '/orders', icon: ShoppingBag, label: 'Orders', roles: ['user', 'admin', 'super_admin'] },
  { path: '/services', icon: Layers, label: 'Services', roles: ['user', 'admin', 'super_admin'] },
  { path: '/wallet', icon: Wallet, label: 'Add Funds', roles: ['user', 'admin', 'super_admin'] },
  { path: '/transactions', icon: CreditCard, label: 'Transactions', roles: ['user', 'admin', 'super_admin'] },
  { path: '/referrals', icon: Gift, label: 'Referrals', roles: ['user', 'admin', 'super_admin'] },
  { path: '/tickets', icon: Ticket, label: 'Tickets', roles: ['user', 'admin', 'super_admin'] },
  { path: '/api', icon: Key, label: 'API', roles: ['user', 'admin', 'super_admin'] },
  { path: '/account', icon: User, label: 'Account', roles: ['user', 'admin', 'super_admin'] },
  { path: '/admin/users', icon: Users, label: 'Users', roles: ['admin', 'super_admin'] },
  { path: '/admin/settings', icon: Settings, label: 'Settings', roles: ['admin', 'super_admin'] },
];

export const Sidebar = () => {
  const { user, logout } = useAuth();
  const [isOpen, setIsOpen] = useState(false);
  const filtered = navItems.filter(item => item.roles.includes(user?.role || 'user'));

  const toggleSidebar = () => setIsOpen(!isOpen);
  const closeSidebar = () => setIsOpen(false);

  return (
    <>
      <button
        onClick={toggleSidebar}
        className="md:hidden fixed top-4 left-4 z-50 p-2.5 bg-dark-card border border-dark-border rounded-xl hover:bg-dark-border transition-colors"
      >
        {isOpen ? <X size={24} className="text-white" /> : <Menu size={24} className="text-white" />}
      </button>

      <aside className={`
        fixed md:relative w-72 bg-dark-card border-r border-dark-border flex flex-col h-full z-40
        transition-transform duration-300 ease-in-out
        ${isOpen ? 'translate-x-0' : '-translate-x-full md:translate-x-0'}
      `}>
        <div className="p-4 border-b border-dark-border flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-gold/20 flex items-center justify-center">
            <Sparkles className="text-gold" size={24} />
          </div>
          <div>
            <span className="text-xl font-bold text-gold block leading-tight">MEGA</span>
            <span className="text-xs font-normal text-gray-400 block -mt-0.5">SOCIALS</span>
          </div>
        </div>

        <nav className="flex-1 p-4 space-y-1 overflow-y-auto">
          {filtered.map((item) => (
            <NavLink
              key={item.path}
              to={item.path}
              onClick={closeSidebar}
              className={({ isActive }) => `
                flex items-center gap-3 px-4 py-2.5 rounded-lg transition-all duration-200
                ${isActive
                  ? 'bg-gold/10 text-gold shadow-[inset_0_1px_1px_rgba(245,197,24,0.1)]'
                  : 'text-gray-300 hover:bg-dark-border hover:text-white hover:translate-x-1'
                }
              `}
            >
              <item.icon size={20} className="flex-shrink-0" />
              <span className="text-sm font-medium flex-1">{item.label}</span>
              {item.label === 'Dashboard' && (
                <span className="text-[10px] bg-gold/20 text-gold px-2 py-0.5 rounded-full">v1.0</span>
              )}
            </NavLink>
          ))}
        </nav>

        <div className="p-4 border-t border-dark-border">
          <button
            onClick={() => { logout(); closeSidebar(); }}
            className="flex items-center gap-3 px-4 py-2.5 w-full rounded-lg text-red-400 hover:bg-red-500/10 transition-all duration-200 hover:translate-x-1"
          >
            <LogOut size={20} />
            <span className="text-sm">Logout</span>
          </button>
        </div>
      </aside>
    </>
  );
};
