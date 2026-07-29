import { useState, useEffect } from 'react';
import { api } from '../../services/api';
import { toast } from 'react-toastify';
import { Search, Filter, ArrowUpDown } from 'lucide-react';

const socialIcons: Record<string, string> = {
  'tiktok': 'https://cdn.jsdelivr.net/npm/simple-icons@v9/icons/tiktok.svg',
  'instagram': 'https://cdn.jsdelivr.net/npm/simple-icons@v9/icons/instagram.svg',
  'youtube': 'https://cdn.jsdelivr.net/npm/simple-icons@v9/icons/youtube.svg',
  'facebook': 'https://cdn.jsdelivr.net/npm/simple-icons@v9/icons/facebook.svg',
  'telegram': 'https://cdn.jsdelivr.net/npm/simple-icons@v9/icons/telegram.svg',
  'twitter': 'https://cdn.jsdelivr.net/npm/simple-icons@v9/icons/twitter.svg',
  'spotify': 'https://cdn.jsdelivr.net/npm/simple-icons@v9/icons/spotify.svg',
};

export const ServiceList = () => {
  const [services, setServices] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');

  useEffect(() => {
    api.get('/api/services')
      .then(res => { setServices(res.data); setLoading(false); })
      .catch(() => setLoading(false));
  }, []);

  const filteredServices = services.filter((service: any) =>
    service.name?.toLowerCase().includes(search.toLowerCase())
  );

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="text-center">
          <div className="w-10 h-10 border-4 border-gold/30 border-t-gold rounded-full animate-spin mx-auto"></div>
          <p className="text-gray-400 mt-4">Loading services...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="p-4">
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between mb-6 gap-4">
        <h2 className="text-2xl font-bold text-white">Services</h2>
        <div className="relative w-full md:w-64">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search services..."
            className="w-full bg-dark-bg border border-dark-border rounded-xl pl-10 pr-4 py-2 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-gold/50 focus:border-transparent transition-all"
          />
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredServices.length === 0 ? (
          <div className="col-span-full text-center text-gray-400 py-8">
            {search ? 'No services match your search' : 'No services available'}
          </div>
        ) : (
          filteredServices.map((service: any) => {
            const iconKey = service.name?.toLowerCase().split(' ')[0] || '';
            const iconUrl = socialIcons[iconKey] || '/default-icon.svg';
            return (
              <div
                key={service.id}
                className="bg-dark-card border border-dark-border rounded-xl p-5 hover:border-gold/30 transition-all duration-300 hover:shadow-[0_0_30px_rgba(245,197,24,0.05)] group"
              >
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-xl bg-dark-bg flex items-center justify-center group-hover:bg-gold/10 transition-colors overflow-hidden">
                    <img
                      src={iconUrl}
                      alt={service.name}
                      className="w-8 h-8 object-contain"
                      onError={(e) => { (e.target as HTMLImageElement).src = '/default-icon.svg'; }}
                    />
                  </div>
                  <div className="flex-1 min-w-0">
                    <h4 className="text-white font-medium truncate">{service.name}</h4>
                    <p className="text-gray-400 text-xs">Min: {service.min} | Max: {service.max}</p>
                  </div>
                </div>
                <div className="flex items-center justify-between mt-4">
                  <span className="text-gold font-bold text-lg">₦{parseFloat(service.cost).toFixed(2)}/1000</span>
                  <button
                    onClick={() => toast.info('Order functionality coming soon')}
                    className="bg-gold/10 text-gold px-4 py-1.5 rounded-lg text-sm hover:bg-gold/20 transition-all duration-200 hover:scale-[1.02] active:scale-95"
                  >
                    Order Now
                  </button>
                </div>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
};
