import i18n from 'i18next';
import HttpBackend from 'i18next-http-backend';
import { initReactI18next } from 'react-i18next';

import config from '@/config';
import {
  getLocaleFromPathname,
  isLocale,
  removeBasePath,
  supportedLocales,
} from '@/locales';

const routePath = removeBasePath(window.location.pathname, config.appBasePath);
const localeFromPath = getLocaleFromPathname(routePath);
const storedLocale = window.localStorage.getItem('app-locale');
const initialLocale = localeFromPath ?? (isLocale(storedLocale) ? storedLocale : config.defaultLocale);

if (localeFromPath) {
  window.localStorage.setItem('app-locale', localeFromPath);
}

const webpackPublicUrl = new URL(__webpack_public_path__, window.location.origin);
export const appAssetBaseUrl = webpackPublicUrl.href.endsWith('/')
  ? webpackPublicUrl.href
  : `${webpackPublicUrl.href}/`;

void i18n
  .use(HttpBackend)
  .use(initReactI18next)
  .init({
    lng: initialLocale,
    backend: {
      loadPath: `${appAssetBaseUrl}locales/{{lng}}.json`,
    },
    fallbackLng: config.defaultLocale,
    supportedLngs: [...supportedLocales],
    defaultNS: 'translation',
    ns: ['translation'],
    interpolation: {
      escapeValue: false,
    },
  });

export default i18n;
