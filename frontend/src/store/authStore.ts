import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { api } from '../services/api';
import { toast } from 'react-toastify';

interface AuthState {
  user: any | null;
  token: string | null;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<void>;
  logout: () => void;
  setUser: (user: any) => void;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set, get) => ({
      user: null,
      token: null,
      isLoading: false,
      login: async (email, password) => {
        set({ isLoading: true });
        try {
          const res = await api.post('/api/auth/login', { email, password });
          set({ user: res.data.user, token: res.data.token, isLoading: false });
          toast.success('Welcome back!');
        } catch (err: any) {
          set({ isLoading: false });
          const errorMsg = err.response?.data?.error || 'Login failed';
          toast.error(errorMsg);
          throw err;
        }
      },
      logout: () => {
        set({ user: null, token: null });
        toast.info('Logged out');
      },
      setUser: (user) => set({ user }),
    }),
    { name: 'auth-storage' }
  )
);
