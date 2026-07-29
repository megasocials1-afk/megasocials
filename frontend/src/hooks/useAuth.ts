import { useAuthStore } from '../store/authStore';
export const useAuth = () => {
  const { user, token, isLoading, login, logout, setUser } = useAuthStore();
  return { user, token, isLoading, login, logout, setUser };
};
