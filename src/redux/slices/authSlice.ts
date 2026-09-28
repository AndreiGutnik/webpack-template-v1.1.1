import { PayloadAction, createSlice } from '@reduxjs/toolkit';

import { AuthState, IUser } from '@/types';

const initialState: AuthState = {
  user: null,
  accessToken: null,
  status: 'checking',
};

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    setCredentials(
      state,
      action: PayloadAction<{
        accessToken: string;
        user: IUser;
      }>
    ) {
      state.accessToken = action.payload.accessToken;
      state.user = action.payload.user;
      state.status = 'authenticated';
    },

    logout(state) {
      state.accessToken = null;
      state.user = null;
      state.status = 'unauthenticated';
    },
  },
});

export const { setCredentials, logout } = authSlice.actions;

export default authSlice.reducer;
