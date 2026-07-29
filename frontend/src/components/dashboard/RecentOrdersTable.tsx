import { Badge } from '../common/Badge';

const orders = [
  { id: '#MS2415', service: 'TikTok Followers [High Quality]', qty: 1000, status: 'In Progress', date: 'May 17, 2025 10:45 AM' },
  { id: '#MS2414', service: 'Instagram Likes [Instant]', qty: 500, status: 'Completed', date: 'May 17, 2025 09:30 AM' },
  { id: '#MS2413', service: 'YouTube Views [Real]', qty: 2000, status: 'In Progress', date: 'May 16, 2025 11:20 PM' },
  { id: '#MS2412', service: 'Facebook Followers [HQ]', qty: 1000, status: 'Completed', date: 'May 16, 2025 08:15 PM' },
  { id: '#MS2411', service: 'Telegram Members [Real]', qty: 500, status: 'Cancelled', date: 'May 16, 2025 05:40 PM' },
];

const statusVariant: Record<string, any> = {
  'In Progress': 'warning',
  'Completed': 'success',
  'Cancelled': 'danger',
};

export const RecentOrdersTable = () => {
  return (
    <div className="bg-dark-card border border-dark-border rounded-xl p-5 transition-all duration-300 hover:border-gold/20">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold text-white">Recent Orders</h3>
        <a href="/orders" className="text-gold text-sm hover:underline flex items-center gap-1">
          View All →
        </a>
      </div>
      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="text-gray-400 border-b border-dark-border">
              <th className="text-left py-2 font-medium">ID</th>
              <th className="text-left py-2 font-medium">Service</th>
              <th className="text-left py-2 font-medium">Quantity</th>
              <th className="text-left py-2 font-medium">Status</th>
              <th className="text-left py-2 font-medium">Date</th>
            </tr>
          </thead>
          <tbody>
            {orders.map((order) => (
              <tr key={order.id} className="border-b border-dark-border/30 hover:bg-dark-bg/30 transition-all duration-200">
                <td className="py-3 text-gold font-mono text-xs font-medium">{order.id}</td>
                <td className="py-3 text-white text-sm">{order.service}</td>
                <td className="py-3 text-gray-300 text-sm">{order.qty}</td>
                <td className="py-3"><Badge variant={statusVariant[order.status] || 'default'}>{order.status}</Badge></td>
                <td className="py-3 text-gray-400 text-xs">{order.date}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};
