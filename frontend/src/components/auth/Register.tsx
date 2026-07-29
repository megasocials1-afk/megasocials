import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { api } from '../../services/api';
import { Sparkles, Mail, Lock, User, ArrowRight, Eye, EyeOff } from 'lucide-react';
import { toast } from 'react-toastify';
import { Link } from 'react-router-dom';

export const Register = () => {
  const [email, setEmail] = useState('');
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [referralCode, setReferralCode] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (password !== confirmPassword) {
      toast.error('Passwords do not match');
      return;
    }
    if (password.length < 6) {
      toast.error('Password must be at least 6 characters');
      return;
    }
    setLoading(true);
    try {
      const res = await api.post('/api/auth/register', {
        email,
        username,
        password,
        referralCode: referralCode || undefined,
      });
      toast.success('Registration successful! Check your email for verification.');
      navigate('/verify', { state: { userId: res.data.user.id } });
    } catch (err: any) {
      const errorMsg = err.response?.data?.error || 'Registration failed';
      if (errorMsg.includes('duplicate key')) {
        toast.error('This email or username is already taken. Please use a different one.');
      } else {
        toast.error(errorMsg);
      }
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
          <p className="text-gray-400 text-sm mt-1">Create your account</p>
        </div>

        <div className="glass rounded-2xl p-6 md:p-8">
          <h2 className="text-xl font-semibold text-white mb-2">Get Started</h2>
          <p className="text-gray-400 text-sm mb-6">Join the fastest SMM panel</p>

          <form onSubmit={handleSubmit} className="space-y-4">
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

            <div className="relative">
              <User className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
              <input
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                placeholder="Username"
                className="w-full bg-white text-black rounded-xl pl-10 pr-4 py-3 border border-gray-300 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-gold/50 focus:border-transparent transition-all"
                required
              />
            </div>

            <div className="relative">
              <Lock className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
              <input
                type={showPassword ? 'text' : 'password'}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Password"
                className="w-full bg-white text-black rounded-xl pl-10 pr-12 py-3 border border-gray-300 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-gold/50 focus:border-transparent transition-all"
                required
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors"
              >
                {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
            </div>

            <div className="relative">
              <Lock className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
              <input
                type={showConfirmPassword ? 'text' : 'password'}
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                placeholder="Confirm Password"
                className="w-full bg-white text-black rounded-xl pl-10 pr-12 py-3 border border-gray-300 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-gold/50 focus:border-transparent transition-all"
                required
              />
              <button
                type="button"
                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors"
              >
                {showConfirmPassword ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
            </div>

            <div className="relative">
              <input
                type="text"
                value={referralCode}
                onChange={(e) => setReferralCode(e.target.value)}
                placeholder="Referral code (optional)"
                className="w-full bg-white text-black rounded-xl px-4 py-3 border border-gray-300 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-gold/50 focus:border-transparent transition-all"
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-gold text-black py-3 rounded-xl font-medium hover:bg-gold/90 transition-all duration-200 hover:scale-[1.02] active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
            >
              {loading ? 'Creating account...' : 'Create Account'}
              <ArrowRight size={18} />
            </button>
          </form>

          <p className="text-center text-gray-400 text-sm mt-6">
            Already have an account?{' '}
            <Link to="/login" className="text-gold hover:underline font-medium">
              Sign In
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};
