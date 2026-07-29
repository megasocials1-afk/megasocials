import { Bell, User, LogOut, Settings } from 'lucide-react';
import { useAuth } from '../../hooks/useAuth';
import { useNavigate } from 'react-router-dom';
import { useState } from 'react';

export const Header = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [showDropdown, setShowDropdown] = useState(false);

  return (
    <header className="bg-dark-card border-b border-dark-border px-4 md:px-6 py-4 flex items-center justify-between">
      <div className="flex items-center gap-4">
        <h2 className="text-xl font-semibold text-white hidden md:block">Dashboard</h2>
      </div>
      <div className="flex items-center gap-4">
        <button className="relative p-2 rounded-lg hover:bg-dark-border transition-colors">
          <Bell size={20} className="text-gray-400" />
          <span className="absolute top-1 right-1 w-2.5 h-2.5 bg-gold rounded-full ring-2 ring-dark-card"></span>
        </button>
        <div className="relative">
          <button
            onClick={() => setShowDropdown(!showDropdown)}
            className="flex items-center gap-2 hover:bg-dark-border p-2 rounded-lg transition-colors"
          >
            <div className="w-8 h-8 rounded-full bg-gold/20 flex items-center justify-center">
              <User size={18} className="text-gold" />
            </div>
            <span className="text-sm text-gray-300 hidden md:inline">{user?.username || 'User'}</span>
          </button>
          {showDropdown && (
            <div className="absolute right-0 mt-2 w-48 bg-dark-card border border-dark-border rounded-xl shadow-2xl overflow-hidden z-50">
              <div className="p-3 border-b border-dark-border">
                <p className="text-sm font-medium text-white">{user?.username}</p>
                <p className="text-xs text-gray-400 truncate">{user?.email}</p>
              </div>
              <button
                onClick={() => { navigate('/account'); setShowDropdown(false); }}
                className="w-full flex items-center gap-3 px-4 py-2.5 text-gray-300 hover:bg-dark-border transition-colors text-sm"
              >
                <Settings size={16} /> Account Settings
              </button>
              <button
                onClick={() => { logout(); setShowDropdown(false); }}
                className="w-full flex items-center gap-3 px-4 py-2.5 text-red-400 hover:bg-red-500/10 transition-colors text-sm"
              >
                <LogOut size={16} /> Logout
              </button>
            </div>
          )}
        </div>
      </div>
    </header>
  );
};
