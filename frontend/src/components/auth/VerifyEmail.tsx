import { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { api } from '../../services/api';
import { toast } from 'react-toastify';
import { Sparkles, Mail, CheckCircle } from 'lucide-react';

export const VerifyEmail = () => {
  const [code, setCode] = useState('');
  const [userId, setUserId] = useState('');
  const [loading, setLoading] = useState(false);
  const [resendLoading, setResendLoading] = useState(false);
  const [resendCooldown, setResendCooldown] = useState(0);
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    if (location.state?.userId) {
      setUserId(location.state.userId);
    }
  }, [location]);

  useEffect(() => {
    if (resendCooldown > 0) {
      const timer = setTimeout(() => setResendCooldown(resendCooldown - 1), 1000);
      return () => clearTimeout(timer);
    }
  }, [resendCooldown]);

  const handleVerify = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!userId || !code) {
      toast.error('Please enter your user ID and verification code');
      return;
    }
    setLoading(true);
    try {
      await api.post('/api/auth/verify-email', { userId, code });
      toast.success('Email verified successfully!');
      navigate('/login');
    } catch (err: any) {
      toast.error(err.response?.data?.error || 'Verification failed');
    } finally {
      setLoading(false);
    }
  };

  const handleResend = async () => {
    if (resendCooldown > 0) return;
    if (!userId) {
      toast.error('User ID is required to resend code');
      return;
    }
    setResendLoading(true);
    try {
      await api.post('/api/auth/resend-verification', { userId });
      toast.success('Verification code resent!');
      setResendCooldown(60);
    } catch (err: any) {
      toast.error(err.response?.data?.error || 'Failed to resend code');
    } finally {
      setResendLoading(false);
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
              <Mail className="text-gold" size={32} />
            </div>
          </div>
          <h1 className="text-3xl font-bold text-white">Verify Your Email</h1>
          <p className="text-gray-400 text-sm mt-1">Enter the 6-digit code sent to your email</p>
        </div>

        <div className="glass rounded-2xl p-6 md:p-8">
          <div className="bg-yellow-500/10 border border-yellow-500/30 text-yellow-400 text-sm p-4 rounded-xl mb-6 flex items-start gap-3">
            <CheckCircle size={18} className="flex-shrink-0 mt-0.5" />
            <div>
              <p className="font-medium">Check your spam folder</p>
              <p className="text-yellow-400/70 text-xs mt-0.5">The verification email might have landed there</p>
            </div>
          </div>

          <form onSubmit={handleVerify} className="space-y-5">
            <div>
              <label className="block text-sm font-medium text-gray-400 mb-1.5">User ID</label>
              <input
                type="text"
                value={userId}
                onChange={(e) => setUserId(e.target.value)}
                placeholder="e.g., 123e4567-e89b-12d3-a456-426614174000"
                className="w-full bg-white text-black rounded-xl px-4 py-3 border border-gray-300 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-gold/50 focus:border-transparent transition-all"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-400 mb-1.5">Verification Code</label>
              <input
                type="text"
                value={code}
                onChange={(e) => setCode(e.target.value)}
                placeholder="Enter 6-digit code"
                maxLength={6}
                className="w-full bg-white text-black rounded-xl px-4 py-3 border border-gray-300 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-gold/50 focus:border-transparent transition-all text-center text-2xl tracking-widest"
                required
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-gold text-black py-3 rounded-xl font-medium hover:bg-gold/90 transition-all duration-200 hover:scale-[1.02] active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? 'Verifying...' : 'Verify Email'}
            </button>
          </form>

          <div className="mt-6 text-center">
            <button
              onClick={handleResend}
              disabled={resendLoading || resendCooldown > 0}
              className="text-sm text-gray-400 hover:text-gold transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {resendLoading ? 'Sending...' : resendCooldown > 0 ? `Resend available in ${resendCooldown}s` : "Didn't receive the code? Resend"}
            </button>
          </div>

          <p className="text-center text-gray-400 text-sm mt-4">
            <button
              onClick={() => navigate('/login')}
              className="text-gold hover:underline font-medium"
            >
              Back to Login
            </button>
          </p>
        </div>
      </div>
    </div>
  );
};
