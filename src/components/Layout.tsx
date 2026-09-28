import { Suspense } from 'react';
import { Navigate, Outlet, useParams } from 'react-router-dom';

import { Header } from './Header/Header';
import { isLocale } from '@/locales';
import { routes } from '@/routes';

export const Layout = () => {
  const { locale } = useParams<{ locale: string }>();

  if (!isLocale(locale)) {
    return <Navigate to={routes.ROOT} replace />;
  }

  return (
    <>
      <Header />
      <main>
        <Suspense fallback={null}>
          <Outlet />
        </Suspense>
      </main>
    </>
  );
};
