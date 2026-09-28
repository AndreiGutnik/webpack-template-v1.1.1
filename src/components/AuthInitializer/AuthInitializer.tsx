import {
  PropsWithChildren,
  useEffect,
  useRef,
} from 'react';
import { Spin } from 'antd';

import { useRefreshMutation } from '@/redux/api/authApi';
import {
  useAppDispatch,
  useAppSelector,
} from '@/redux/hooks';
import {
  logout,
  setCredentials,
} from '@/redux/slices/authSlice';

export const AuthInitializer = ({
  children,
}: PropsWithChildren) => {
  const dispatch = useAppDispatch();
  const status = useAppSelector(
    state => state.auth.status
  );

  const [refresh] = useRefreshMutation();
  const initialized = useRef(false);

  useEffect(() => {
    if (initialized.current) {
      return;
    }

    initialized.current = true;

    const initializeAuth = async () => {
      try {
        const credentials = await refresh().unwrap();

        dispatch(setCredentials(credentials));
      } catch {
        dispatch(logout());
      }
    };

    void initializeAuth();
  }, [dispatch, refresh]);

  if (status === 'checking') {
    return <Spin fullscreen />;
  }

  return children;
};