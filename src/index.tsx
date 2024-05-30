import { Suspense, lazy } from 'react';
import { createRoot } from 'react-dom/client';
import { BrowserRouter, RouterProvider, createBrowserRouter } from 'react-router-dom';
import { ThemeProvider } from 'styled-components';

import { theme } from '@/Theme';
//import { App } from './components/App';
import { Layout } from '@/components/Layout';

const ShopPage = lazy(() => import('@/pages/ShopPage/ShopPage'));
const MainPage = lazy(() => import('@/pages/MainPage/MainPage'));

const isDev = process.env.NODE_ENV === 'development';

const root = document.getElementById('root');

if (!root) {
  throw new Error('root not found');
}

const router = createBrowserRouter(
  [
    {
      path: '/',
      element: <Layout />,
      children: [
        {
          path: '/',
          element: (
            <Suspense fallback={'Loading...'}>
              <MainPage />
            </Suspense>
          ),
        },
        {
          path: '/shop',
          element: (
            <Suspense fallback={'Loading...'}>
              <ShopPage />
            </Suspense>
          ),
        },
      ],
    },
  ],
  {
    basename: isDev ? '/' : '/webpack-template-v1.1.1/',
  }
);

createRoot(root).render(
  <ThemeProvider theme={theme}>
    <RouterProvider router={router} />
  </ThemeProvider>
);
