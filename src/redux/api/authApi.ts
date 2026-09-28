import { createApi } from '@reduxjs/toolkit/query/react';

import { baseQuery } from './baseQuery';
import type {
	AuthResponse,
	CredentialsLogIn
} from '@/types';

export const authApi = createApi({
  reducerPath: 'authApi',
  baseQuery,
  tagTypes: ['Auth'],

  endpoints: builder => ({
    login: builder.mutation<AuthResponse, CredentialsLogIn>({
      query: credentials => ({
        url: '/auth/login',
        method: 'POST',
        body: credentials,
      }),
    }),

    refresh: builder.mutation<AuthResponse, void>({
      query: () => ({
        url: '/auth/refresh',
        method: 'POST',
      }),
    }),

    logout: builder.mutation<void, void>({
      query: () => ({
        url: '/auth/logout',
        method: 'POST',
      }),
    }),
  }),
});

export const {
	useLoginMutation,
	useRefreshMutation,
	useLogoutMutation
} = authApi;
