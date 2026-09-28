import { AuthForm } from '@/components/AuthForm/AuthForm';

import cls from './LoginPage.module.scss';
import { useTranslation } from 'react-i18next';

export default function LoginPage() {
  const { t } = useTranslation();

  return (
    <main className={cls.page}>
      <h1>{t('app.title')}</h1>
      <p>{t('app.description')}</p>
      <AuthForm />
    </main>
  );
}