import { FetchArgs } from '@reduxjs/toolkit/query/react';

import { baseQuery } from './baseQuery';
import { logout, setCredentials } from '@/redux/slices/authSlice';

export const baseQueryWithReauth = async (
  args: string | FetchArgs,
  api: any,
  extraOptions: any
) => {
  let result = await baseQuery(args, api, extraOptions);

  if (result.error?.status === 401) {
    const refreshResult = await baseQuery(
      {
        url: '/auth/refresh',
        method: 'POST',
      },
      api,
      extraOptions
    );

    if (refreshResult.data) {
      const data = refreshResult.data as {
        accessToken: string;
        user: any;
      };

      api.dispatch(
        setCredentials({
          accessToken: data.accessToken,

          user: data.user,
        })
      );

      result = await baseQuery(args, api, extraOptions);
    } else {
      api.dispatch(logout());
    }
  }

  return result;
};
