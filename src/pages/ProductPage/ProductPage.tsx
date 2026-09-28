import { useTranslation } from 'react-i18next';
import { Link } from 'react-router-dom';

export default function ProductPage() {
  const { t } = useTranslation();

  return (
    <div
      className="container"
      style={{ paddingTop: '40px' }}
    >
      <h1>{t('app.productTitle')}</h1>
      <Link to="..">{t('app.back')}</Link>
    </div>
  );
}
