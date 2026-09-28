import { useAppSelector } from '@/redux/hooks';

export const useAuth = () => {
  const status = useAppSelector(state => state.auth.status);

  return {
    user: useAppSelector(state => state.auth.user),
    isAuthenticated: status === 'authenticated',
    isCheckingAuth: status === 'checking',
  };
};