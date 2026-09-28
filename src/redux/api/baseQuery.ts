import { fetchBaseQuery } from '@reduxjs/toolkit/query/react';

import type { RootState } from '@/redux/store';

export const baseQuery = fetchBaseQuery({
  baseUrl: 'https://ypsilonworkcrm.sunsetcore.cz/api',

  credentials: 'include',

  prepareHeaders: (headers, { getState }) => {
    const token = (getState() as RootState).auth.accessToken;

    if (token) {
      headers.set('Authorization', `Bearer ${token}`);
    }

    return headers;
  },
});
