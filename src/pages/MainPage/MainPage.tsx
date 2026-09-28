import { useTranslation } from 'react-i18next';
import { Link } from 'react-router-dom';

import { AuthForm } from '@/components/AuthForm/AuthForm';

export default function MainPage() {
  const { t } = useTranslation();

  return (
    <div
      className="container"
      style={{ paddingTop: '40px' }}
    >
      <h1>{t('app.title')}</h1>
      <p>{t('app.description')}</p>
      <Link to="product">{t('app.productLink')}</Link>
      <AuthForm />
    </div>
  );
}
