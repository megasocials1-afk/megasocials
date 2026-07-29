import { useState } from 'react';
import { api } from '../../services/api';
import { toast } from 'react-toastify';
import { Wallet, ArrowRight } from 'lucide-react';

export const Deposit = () => {
  const [amount, setAmount] = useState('');
  const [loading, setLoading] = useState(false);

  const handleDeposit = async () => {
    const numAmount = parseFloat(amount);
    if (!amount || isNaN(numAmount) || numAmount < 100) {
      toast.error('Minimum deposit is ₦100');
      return;
    }
    setLoading(true);
    try {
      const res = await api.post('/api/deposits', { amount: numAmount });
      if (res.data.payment_link) {
        window.open(res.data.payment_link, '_blank');
        toast.success('Redirecting to payment page...');
      } else {
        toast.info('Deposit request created. Awaiting approval.');
      }
    } catch (err: any) {
      toast.error(err.response?.data?.error || 'Deposit failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-4 max-w-md mx-auto">
      <div className="glass rounded-2xl p-6">
        <div className="flex items-center gap-3 mb-6">
          <div className="p-3 rounded-xl bg-gold/20">
            <Wallet className="text-gold" size={24} />
          </div>
          <div>
            <h2 className="text-xl font-bold text-white">Fund Wallet</h2>
            <p className="text-gray-400 text-sm">Add money to your wallet</p>
          </div>
        </div>

        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-400 mb-1.5">
              Amount (₦)
            </label>
            <input
              type="number"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              placeholder="Enter amount (min ₦100)"
              min="100"
              step="1"
              className="w-full bg-white text-black rounded-xl px-4 py-3 border border-gray-300 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-gold/50 focus:border-transparent transition-all"
            />
            <p className="text-gray-500 text-xs mt-1">Minimum deposit: ₦100</p>
          </div>

          <button
            onClick={handleDeposit}
            disabled={loading}
            className="w-full bg-gold text-black py-3 rounded-xl font-medium hover:bg-gold/90 transition-all duration-200 hover:scale-[1.02] active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
          >
            {loading ? 'Processing...' : 'Deposit Funds'}
            <ArrowRight size={18} />
          </button>
        </div>
      </div>
    </div>
  );
};
