import { lazy } from 'react';
import { Navigate, Route, Routes, useLocation } from 'react-router-dom';
import { useTranslation } from 'react-i18next';

import { Layout } from './Layout';
import config from '@/config';
import { routes } from '@/routes';
import { isLocale, normalizeLocale } from '@/locales';
import { PrivateRoute } from './PrivateRoute';
import { PublicRoute } from './PublicRoute';

// const MainPage = lazy(() => import('@/pages/MainPage/MainPage'));
const LoginPage = lazy(() => import('@/pages/LoginPage/LoginPage'));
const WelcomePage = lazy(() => import('@/pages/WelcomePage/WelcomePage'));
const ProductPage = lazy(() => import('@/pages/ProductPage/ProductPage'));

const LocaleRootRedirect = () => {
  const { i18n } = useTranslation();
  const { search, hash } = useLocation();
  const detectedLocale = normalizeLocale(i18n.resolvedLanguage ?? i18n.language);
  const locale = isLocale(detectedLocale) ? detectedLocale : config.defaultLocale;

  return <Navigate to={{ pathname: `/${locale}`, search, hash }} replace />;
};

const LocalizedNotFoundRedirect = () => {
  const { search, hash } = useLocation();

  return <Navigate to={{ pathname: routes.HOME, search, hash }} replace />;
};

export const App = () => {
  return (
    <Routes>
      <Route
        path={routes.ROOT}
        element={<LocaleRootRedirect />}
      />

      <Route
        path={routes.LOCALIZED}
        element={<Layout />}
      >
        <Route element={<PublicRoute />}>
          <Route
            path={routes.LOGIN}
            element={<LoginPage />}
          />
        </Route>

        <Route element={<PrivateRoute />}>
          <Route
            index
            element={<WelcomePage />}
          />

          <Route
            path={routes.PRODUCT}
            element={<ProductPage />}
          />
        </Route>

        <Route
          path="*"
          element={<LocalizedNotFoundRedirect />}
        />
      </Route>

      <Route
        path="*"
        element={<Navigate to={routes.ROOT} replace />}
      />
    </Routes>
  );
};
