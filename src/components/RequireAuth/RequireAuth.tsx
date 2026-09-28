import { Navigate, Outlet } from 'react-router-dom';

import { useAppSelector } from '@/redux/hooks';

export const RequireAuth = () => {
  const status = useAppSelector(
    state => state.auth.status
  );

  if (status !== 'authenticated') {
    return (
      <Navigate
        to="/login"
        replace
      />
    );
  }

  return <Outlet />;
};