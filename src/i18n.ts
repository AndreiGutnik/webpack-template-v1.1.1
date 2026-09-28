import i18n from 'i18next';
import LanguageDetector from 'i18next-browser-languagedetector';
import HttpBackend from 'i18next-http-backend';
import { initReactI18next } from 'react-i18next';

const localeFromPath = window.location.pathname.match(/^\/(ru|cz|ua)(?=\/|$)/)?.[1];
const pathnameWithoutLocale =
  window.location.pathname.replace(/^\/(?:ru|cz|ua)(?=\/|$)/, '') || '/';
export const appBasePath = new URL('.', `${window.location.origin}${pathnameWithoutLocale}`)
  .pathname;

void i18n
  .use(HttpBackend)
  .use(LanguageDetector)
  .use(initReactI18next)
  .init({
    lng: localeFromPath,
    backend: {
      loadPath: `${appBasePath}locales/{{lng}}.json`,
    },
    detection: {
      order: ['localStorage', 'navigator'],
      caches: ['localStorage'],
    },
    fallbackLng: 'ru',
    supportedLngs: ['ru', 'cz', 'ua'],
    defaultNS: 'translation',
    ns: ['translation'],
    interpolation: {
      escapeValue: false,
    },
  });

export default i18n;
