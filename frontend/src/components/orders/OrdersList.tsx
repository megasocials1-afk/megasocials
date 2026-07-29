import { useState, useEffect } from 'react';
import { api } from '../../services/api';
import { Badge } from '../common/Badge';
import { toast } from 'react-toastify';

export const OrdersList = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.get('/api/orders')
      .then(res => { setOrders(res.data); setLoading(false); })
      .catch(() => { toast.error('Failed to load orders'); setLoading(false); });
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="w-10 h-10 border-4 border-gold/30 border-t-gold rounded-full animate-spin"></div>
      </div>
    );
  }

  const statusVariant: Record<string, any> = {
    pending: 'warning',
    processing: 'warning',
    in_progress: 'warning',
    completed: 'success',
    partial: 'info',
    canceled: 'danger',
    refunded: 'default',
  };

  return (
    <div className="p-4">
      <h2 className="text-2xl font-bold text-white mb-6">Your Orders</h2>
      {orders.length === 0 ? (
        <div className="text-center text-gray-400 py-8">No orders yet</div>
      ) : (
        <div className="glass rounded-xl overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="bg-dark-bg/50 border-b border-dark-border">
                <tr>
                  <th className="text-left p-3 text-gray-400 font-medium">ID</th>
                  <th className="text-left p-3 text-gray-400 font-medium">Service</th>
                  <th className="text-left p-3 text-gray-400 font-medium">Quantity</th>
                  <th className="text-left p-3 text-gray-400 font-medium">Price</th>
                  <th className="text-left p-3 text-gray-400 font-medium">Status</th>
                  <th className="text-left p-3 text-gray-400 font-medium">Date</th>
                </tr>
              </thead>
              <tbody>
                {orders.map((order: any) => (
                  <tr key={order.id} className="border-b border-dark-border/30 hover:bg-dark-bg/30 transition-colors">
                    <td className="p-3 text-gold font-mono text-xs">#{order.id.slice(0, 8)}</td>
                    <td className="p-3 text-white">{order.service_name || 'N/A'}</td>
                    <td className="p-3 text-gray-300">{order.quantity}</td>
                    <td className="p-3 text-gold font-medium">₦{parseFloat(order.price).toFixed(2)}</td>
                    <td className="p-3"><Badge variant={statusVariant[order.status] || 'default'}>{order.status}</Badge></td>
                    <td className="p-3 text-gray-400 text-xs">{new Date(order.created_at).toLocaleString()}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
};
