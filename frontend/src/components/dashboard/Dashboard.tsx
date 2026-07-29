import { useState, useEffect } from 'react';
import { api } from '../../services/api';
import { StatsCard } from './StatsCard';
import { RecentOrdersTable } from './RecentOrdersTable';
import { TopCategories } from './TopCategories';
import { BalanceChart } from './BalanceChart';
import { NewsUpdates } from './NewsUpdates';
import { Wallet, ShoppingBag, Loader, CheckCircle, XCircle, Users, TrendingUp, TrendingDown } from 'lucide-react';
import { toast } from 'react-toastify';

export const Dashboard = () => {
  const [stats, setStats] = useState({
    totalUsers: 0,
    totalOrders: 0,
    totalRevenue: 0,
    pendingOrders: 0,
    totalBalance: 0,
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    api.get('/api/admin/dashboard')
      .then(res => {
        setStats(res.data);
        setLoading(false);
      })
      .catch(err => {
        console.error('Dashboard error:', err);
        setError('Could not load dashboard data. Please refresh.');
        setLoading(false);
        toast.error('Failed to load dashboard stats');
      });
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="text-center">
          <div className="w-12 h-12 border-4 border-gold/30 border-t-gold rounded-full animate-spin mx-auto"></div>
          <p className="text-gray-400 mt-4">Loading dashboard...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="text-center">
          <div className="text-red-400 text-xl mb-2">⚠️</div>
          <p className="text-red-400">{error}</p>
          <button
            onClick={() => window.location.reload()}
            className="mt-4 px-6 py-2 bg-gold/20 text-gold rounded-xl hover:bg-gold/30 transition-colors"
          >
            Refresh
          </button>
        </div>
      </div>
    );
  }

  const statCards = [
    {
      title: 'Total Users',
      value: stats.totalUsers,
      subtext: 'Registered users',
      icon: <Users className="text-blue-400" size={24} />,
      trend: 12,
    },
    {
      title: 'Total Orders',
      value: stats.totalOrders,
      subtext: 'All time orders',
      icon: <ShoppingBag className="text-blue-400" size={24} />,
      trend: 8,
    },
    {
      title: 'Total Revenue',
      value: `₦${stats.totalRevenue.toFixed(2)}`,
      subtext: 'Completed orders',
      icon: <Wallet className="text-gold" size={24} />,
      trend: 15,
    },
    {
      title: 'Pending Orders',
      value: stats.pendingOrders,
      subtext: 'Awaiting processing',
      icon: <Loader className="text-yellow-400" size={24} />,
      trend: -3,
    },
    {
      title: 'Total Balance',
      value: `₦${stats.totalBalance.toFixed(2)}`,
      subtext: 'All user wallets',
      icon: <CheckCircle className="text-green-400" size={24} />,
      trend: 5,
    },
  ];

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-2">
        <div>
          <h1 className="text-2xl font-bold text-white">Welcome back, Admin</h1>
          <p className="text-gray-400">Here's what's happening with your platform today.</p>
        </div>
        <div className="flex items-center gap-2 text-sm text-gray-400">
          <span>Last updated: {new Date().toLocaleString()}</span>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
        {statCards.map((card, index) => (
          <StatsCard
            key={index}
            title={card.title}
            value={card.value}
            subtext={card.subtext}
            icon={card.icon}
            trend={card.trend}
          />
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <RecentOrdersTable />
        </div>
        <div>
          <TopCategories />
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <BalanceChart />
        </div>
        <div>
          <NewsUpdates />
        </div>
      </div>
    </div>
  );
};
