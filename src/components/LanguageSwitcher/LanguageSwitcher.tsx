import { useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { useLocation, useNavigate, useParams } from 'react-router-dom';

import styles from './LanguageSwitcher.module.scss';
import i18n, { appBasePath } from '@/i18n';

const languages = ['cz', 'ru', 'ua'] as const;
type Language = (typeof languages)[number];

const languageNames: Record<Language, string> = {
  cz: 'Čeština',
  ru: 'Русский',
  ua: 'Українська',
};

const isLanguage = (value?: string): value is Language =>
  languages.includes(value as Language);

export const LanguageSwitcher = () => {
  const { t } = useTranslation();
  const { locale } = useParams<{ locale?: string }>();
  const { pathname, search, hash } = useLocation();
  const navigate = useNavigate();
  const resolvedLanguage = i18n.resolvedLanguage?.split('-')[0];
  const language: Language = isLanguage(locale)
    ? locale
    : isLanguage(resolvedLanguage)
      ? resolvedLanguage
      : 'ru';

  useEffect(() => {
    if (isLanguage(locale) && i18n.resolvedLanguage !== locale) {
      void i18n.changeLanguage(locale);
    }
  }, [locale]);

  const toggleLanguage = () => {
    const currentIndex = languages.indexOf(language);
    const nextLanguage = languages[(currentIndex + 1) % languages.length];
    const pathWithoutLocale = pathname.replace(/^\/(?:ru|cz|ua)(?=\/|$)/, '') || '/';
    const localizedPath = `/${nextLanguage}${pathWithoutLocale === '/' ? '' : pathWithoutLocale}`;

    navigate(`${localizedPath}${search}${hash}`, { replace: true });
    void i18n.changeLanguage(nextLanguage);
  };

  return (
    <button
      className={styles.flagButton}
      type="button"
      aria-label={t('app.language')}
      title={languageNames[language]}
      onClick={toggleLanguage}
    >
      <img
        src={`${appBasePath}icons/${language}-flag.svg`}
        alt={languageNames[language]}
        width="40"
        height="40"
      />
    </button>
  );
};
