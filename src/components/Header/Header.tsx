import React from 'react';
import { Link } from 'react-router-dom';

import { LanguageSwitcher } from '../LanguageSwitcher/LanguageSwitcher';

import cls from './Header.module.scss';
import { routes } from '@/routes';
import { useAppDispatch } from '@/redux/hooks';
import { authApi, useLogoutMutation } from '@/redux/api/authApi';
import { userApi } from '@/redux/api/userApi';
import { logout } from '@/redux/slices/authSlice';
import { Button } from 'antd';

const Logo: React.FC = React.memo(() => (
  <Link
    className={cls.logoLink}
    to={routes.HOME}
    onClick={() => window.scrollTo(0, 0)}
  >
    <svg
      className={cls.logoYp}
      viewBox="0 0 126 74"
    >
      <use href="#svg_sprite_logo"></use>
    </svg>
  </Link>
));

export const Header = () => {
  const dispatch = useAppDispatch();
  const [logoutRequest, { isLoading }] =
    useLogoutMutation();

  const handleLogout = async () => {
    try {
      await logoutRequest().unwrap();
    } finally {
      dispatch(logout());
      dispatch(authApi.util.resetApiState());
      dispatch(userApi.util.resetApiState());
    }
  };

  return (
    <header>
      <div className={cls.headerWrapper}>
        <div className={`container ${cls.headerContent}`}>
          <Logo />
          <LanguageSwitcher />
          <Button
            loading={isLoading}
            onClick={handleLogout}
          >
            Выйти
          </Button>
        </div>
      </div>
    </header>
  );
};
