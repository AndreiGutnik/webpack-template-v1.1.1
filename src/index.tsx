import { Spin } from 'antd';
import React from 'react';
import ReactDOM from 'react-dom/client';
import { HelmetProvider } from 'react-helmet-async';
import { Provider } from 'react-redux';
import { BrowserRouter } from 'react-router-dom';

//import { PersistGate } from 'redux-persist/integration/react';
import { store } from './redux/store';
// import { persistor } from './redux/store';
import '@/assets/images/svg_sprite.svg';
import { App } from '@/components/App';
import '@/i18n';
import '@/styles/globals.scss';
import { AuthInitializer } from './components/AuthInitializer/AuthInitializer';

const isDev = process.env.NODE_ENV === 'development';

ReactDOM.createRoot(document.getElementById('root') as HTMLElement).render(
  <React.StrictMode>
    <Provider store={store}>
      {/* <PersistGate
      loading={null}
      persistor={persistor}
    > */}
        <AuthInitializer>
          <BrowserRouter basename={isDev ? '/' : '/'}>
            <React.Suspense fallback={<Spin fullscreen />}>
              <HelmetProvider>
                <App />
              </HelmetProvider>
            </React.Suspense>
          </BrowserRouter>
        </AuthInitializer>
      {/* </PersistGate> */}
    </Provider>
  </React.StrictMode>
);
