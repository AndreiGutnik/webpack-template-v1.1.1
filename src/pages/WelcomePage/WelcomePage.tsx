import { Typography } from 'antd';

import { useAuth } from '@/hooks/useAuth';
import { useTranslation } from 'react-i18next';
import { Link } from 'react-router-dom';

export default function WelcomePage() {
  const { t } = useTranslation();
  const { user } = useAuth();

  return (
    <div className="container">
      <h1>{t('app.title')}</h1>
      <p>{t('app.description')}</p>
      <Link to="product">{t('app.productLink')}</Link>
      <Typography.Title level={1}>
        Добро пожаловать, {user?.name} {user?.lastname}!
      </Typography.Title>

      <Typography.Paragraph>
        Вы успешно вошли в систему.
      </Typography.Paragraph>
    </div>
  );
}