import { Navigate, Outlet } from 'react-router-dom';

import { useAppSelector } from '@/redux/hooks';

export const GuestOnly = () => {
  const status = useAppSelector(
    state => state.auth.status
  );

  if (status === 'authenticated') {
    return (
      <Navigate
        to="/"
        replace
      />
    );
  }

  return <Outlet />;
};