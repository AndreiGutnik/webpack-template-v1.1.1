import { AuthForm } from '@/components/AuthForm/AuthForm';

import cls from './LoginPage.module.scss';

export default function LoginPage() {
  return (
    <main className={cls.page}>
      <AuthForm />
    </main>
  );
}