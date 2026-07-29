import { useState } from 'react';
import { useAuth } from '../../hooks/useAuth';
import { Sparkles, Mail, Lock, ArrowRight, Eye, EyeOff } from 'lucide-react';
import { Link } from 'react-router-dom';

export const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const { login, isLoading } = useAuth();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    await login(email, password);
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
          <p className="text-gray-400 text-sm mt-1">SMM Panel Dashboard</p>
        </div>

        <div className="glass rounded-2xl p-6 md:p-8">
          <h2 className="text-xl font-semibold text-white mb-2">Welcome Back</h2>
          <p className="text-gray-400 text-sm mb-6">Sign in to continue to your dashboard</p>

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
                autoComplete="email"
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
                autoComplete="current-password"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors"
              >
                {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="w-full bg-gold text-black py-3 rounded-xl font-medium hover:bg-gold/90 transition-all duration-200 hover:scale-[1.02] active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
            >
              {isLoading ? 'Signing in...' : 'Sign In'}
              <ArrowRight size={18} />
            </button>
          </form>

          <div className="mt-6 text-center">
            <Link to="/forgot-password" className="text-sm text-gray-400 hover:text-gold transition-colors">
              Forgot password?
            </Link>
          </div>

          <p className="text-center text-gray-400 text-sm mt-4">
            Don't have an account?{' '}
            <Link to="/register" className="text-gold hover:underline font-medium">
              Register
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};
