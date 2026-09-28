import { Navigate, Outlet } from 'react-router-dom';

import { routes } from '@/routes';
import { useAuth } from '@/hooks/useAuth';

export const PrivateRoute = () => {
  const { isAuthenticated } = useAuth();

  if (!isAuthenticated) {
    return (
      <Navigate
        to={routes.LOGIN}
        replace
      />
    );
  }

  return <Outlet />;
};
