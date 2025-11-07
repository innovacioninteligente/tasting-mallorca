export const i18n = {
  defaultLocale: 'en',
  locales: ['en', 'ca', 'fr', 'de', 'nl'],
} as const;

export type Locale = (typeof i18n)['locales'][number];
