import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { api } from '../../services/api';
import { toast } from 'react-toastify';
import { Sparkles, Mail, ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';

export const ForgotPassword = () => {
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      await api.post('/api/auth/forgot-password', { email });
      toast.success('Password reset code sent to your email!');
      navigate('/reset-password', { state: { email } });
    } catch (err: any) {
      toast.error(err.response?.data?.error || 'Something went wrong');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-dark-bg relative overflow-hidden p-4">
      <div className="absolute top-0 -left-1/2 w-[600px] h-[600px] bg-gold/10 rounded-full blur-3xl"></div>
      <div className="absolute bottom-0 -right-1/2 w-[600px] h-[600px] bg-blue-500/10 rounded-full blur-3xl"></div>

      <div className="relative z-10 w-full max-w-md">
        <div className="text-center mb-8">
          <div className="flex items-center justify-center gap-3 mb-2">
            <div className="w-16 h-16 rounded-2xl bg-gold/20 flex items-center justify-center">
              <Sparkles className="text-gold" size={36} />
            </div>
          </div>
          <h1 className="text-3xl font-bold text-white">MEGA SOCIALS</h1>
          <p className="text-gray-400 text-sm mt-1">Reset your password</p>
        </div>

        <div className="glass rounded-2xl p-6 md:p-8">
          <h2 className="text-xl font-semibold text-white mb-2">Forgot Password?</h2>
          <p className="text-gray-400 text-sm mb-6">Enter your email and we'll send you a reset code.</p>

          <form onSubmit={handleSubmit} className="space-y-5">
            <div className="relative">
              <Mail className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Email address"
                className="w-full bg-white text-black rounded-xl pl-10 pr-4 py-3 border border-gray-300 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-gold/50 focus:border-transparent transition-all"
                required
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-gold text-black py-3 rounded-xl font-medium hover:bg-gold/90 transition-all duration-200 hover:scale-[1.02] active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
            >
              {loading ? 'Sending...' : 'Send Reset Link'}
              <ArrowRight size={18} />
            </button>
          </form>

          <p className="text-center text-gray-400 text-sm mt-6">
            Remember your password?{' '}
            <Link to="/login" className="text-gold hover:underline font-medium">
              Sign In
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};
