import { configureStore } from '@reduxjs/toolkit';

// import { FLUSH, PAUSE, PERSIST, PURGE, REGISTER, REHYDRATE, persistStore } from 'redux-persist';

import { authApi } from './api/authApi';
import { userApi } from './api/userApi';
import authReducer from './slices/authSlice';

export const store = configureStore({
  reducer: {
    auth: authReducer,
    [authApi.reducerPath]: authApi.reducer,
    [userApi.reducerPath]: userApi.reducer,
  },
  // middleware: getDefaultMiddleware =>
  //   getDefaultMiddleware({
  //     serializableCheck: {
  //       ignoredActions: [FLUSH, REHYDRATE, PAUSE, PERSIST, PURGE, REGISTER],
  //     },
  //   }).concat(authApi.middleware, userApi.middleware),

  middleware: getDefaultMiddleware =>
    getDefaultMiddleware().concat(authApi.middleware, userApi.middleware),
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

// export const persistor = persistStore(store);
