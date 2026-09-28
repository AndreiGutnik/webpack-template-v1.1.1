import { createApi } from '@reduxjs/toolkit/query/react';

import { baseQueryWithReauth } from './baseQueryWithReauth';

export const userApi = createApi({
  reducerPath: 'userApi',
  baseQuery: baseQueryWithReauth,
  tagTypes: ['User'],

  endpoints: builder => ({
    signup: builder.mutation({
      query: data => ({
        url: '/users/signup',
        method: 'POST',
        body: data,
      }),
    }),

    verifyEmail: builder.query({
      query: verificationLink => ({
        url: `/users/verify/${verificationLink}`,
        method: 'GET',
      }),
    }),

    verifyAdminEmail: builder.query({
      query: verificationLink => ({
        url: `/users/verify-admin/${verificationLink}`,
        method: 'GET',
      }),
    }),
  }),
});

export const { useSignupMutation, useVerifyEmailQuery, useVerifyAdminEmailQuery } = userApi;
