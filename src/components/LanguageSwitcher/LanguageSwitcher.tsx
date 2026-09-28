import { useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { useLocation, useNavigate, useParams } from 'react-router-dom';

import styles from './LanguageSwitcher.module.scss';
import i18n, { appAssetBaseUrl } from '@/i18n';
import config from '@/config';
import { isLocale, removeLocalePrefix, supportedLocales } from '@/locales';

const languageNames = {
  cz: 'Čeština',
  ru: 'Русский',
  ua: 'Українська',
} satisfies Record<(typeof supportedLocales)[number], string>;

export const LanguageSwitcher = () => {
  const { t } = useTranslation();
  const { locale } = useParams<{ locale?: string }>();
  const { pathname, search, hash } = useLocation();
  const navigate = useNavigate();
  const resolvedLanguage = i18n.resolvedLanguage?.split('-')[0];
  const language = isLocale(locale)
    ? locale
    : isLocale(resolvedLanguage)
      ? resolvedLanguage
      : config.defaultLocale;

  useEffect(() => {
    if (isLocale(locale)) {
      window.localStorage.setItem('app-locale', locale);

      if (i18n.resolvedLanguage !== locale) {
        void i18n.changeLanguage(locale);
      }
    }
  }, [locale]);

  const toggleLanguage = () => {
    const currentIndex = supportedLocales.indexOf(language);
    const nextLanguage = supportedLocales[(currentIndex + 1) % supportedLocales.length];
    const pathWithoutLocale = removeLocalePrefix(pathname);
    const localizedPath = `/${nextLanguage}${pathWithoutLocale === '/' ? '' : pathWithoutLocale}`;

    window.localStorage.setItem('app-locale', nextLanguage);
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
        src={`${appAssetBaseUrl}icons/${language}-flag.svg`}
        alt={languageNames[language]}
        width="40"
        height="40"
      />
    </button>
  );
};
