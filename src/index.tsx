import React from 'react';
import ReactDOM from 'react-dom/client';
import { HelmetProvider } from 'react-helmet-async';
//import { Provider } from 'react-redux';
import { BrowserRouter } from 'react-router-dom';

//import { PersistGate } from 'redux-persist/integration/react';
//import { persistor, store } from './redux/store';
import { App } from '@/components/App';

const isDev = process.env.NODE_ENV === 'development';

ReactDOM.createRoot(document.getElementById('root') as HTMLElement).render(
  <React.StrictMode>
    {/* <Provider store={store}> */}
    {/* <PersistGate
      loading={null}
      persistor={persistor}
    > */}
    <BrowserRouter basename={isDev ? '/' : '/webpack-template-v1.1.1/'}>
      <HelmetProvider>
        <App />
      </HelmetProvider>
    </BrowserRouter>
    {/* </PersistGate> */}
    {/* </Provider> */}
  </React.StrictMode>
);
