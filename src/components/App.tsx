import { lazy } from 'react';
import { Route, Routes } from 'react-router-dom';

import { Layout } from './Layout';
import { routes } from '@/routes';
import { GuestOnly } from './GuestOnly/GuestOnly';
import { RequireAuth } from './RequireAuth/RequireAuth';

// const MainPage = lazy(() => import('@/pages/MainPage/MainPage'));
const LoginPage = lazy(() => import('@/pages/LoginPage/LoginPage'));
const WelcomePage = lazy(() => import('@/pages/WelcomePage/WelcomePage'));
const ProductPage = lazy(() => import('@/pages/ProductPage/ProductPage'));

export const App = () => {
  return (
    <>
      <Routes>
        <Route
          path={routes.LOCALIZED}
          element={<Layout />}
        >
          <Route element={<GuestOnly />}>
            <Route
              path={routes.LOGIN}
              element={<LoginPage />}
            />
          </Route>

          <Route element={<RequireAuth />}>
            <Route
              index
              element={<WelcomePage />}
            />

            <Route
              path={routes.PRODUCT}
              element={<ProductPage />}
            />
          </Route>
        </Route>

        {/* <Route
          path={routes.LOCALIZED}
          element={<Layout />}
        >
          <Route
            index
            element={<MainPage />}
          />
          <Route
            path="product"
            element={<ProductPage />}
          />
        </Route> */}
      </Routes>
    </>
  );
};
