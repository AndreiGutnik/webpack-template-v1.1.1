export const supportedLocales = ['ru', 'cz', 'ua'] as const;

export type Locale = (typeof supportedLocales)[number];

const localePrefixPattern = new RegExp(`^/(?:${supportedLocales.join('|')})(?=/|$)`);
const localeMatchPattern = new RegExp(`^/(${supportedLocales.join('|')})(?=/|$)`);

export function isLocale(value: unknown): value is Locale {
  return typeof value === 'string' && supportedLocales.includes(value as Locale);
}

export function normalizeLocale(value: string): string {
  const language = value.toLowerCase().split(/[-_]/)[0];

  if (language === 'cs') return 'cz';
  if (language === 'uk') return 'ua';

  return language;
}

export function getLocaleFromPathname(pathname: string): Locale | undefined {
  const match = pathname.match(localeMatchPattern)?.[1];
  return isLocale(match) ? match : undefined;
}

export function removeLocalePrefix(pathname: string): string {
  return pathname.replace(localePrefixPattern, '') || '/';
}

export function normalizeBasePath(basePath: string): string {
  const segments = basePath.split('/').filter(Boolean);
  return segments.length > 0 ? `/${segments.join('/')}/` : '/';
}

export function removeBasePath(pathname: string, basePath: string): string {
  const normalizedBasePath = normalizeBasePath(basePath);

  if (normalizedBasePath === '/') return pathname;
  if (pathname === normalizedBasePath.slice(0, -1)) return '/';
  if (!pathname.startsWith(normalizedBasePath)) return pathname;

  return `/${pathname.slice(normalizedBasePath.length)}`;
}