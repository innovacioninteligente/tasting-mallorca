import 'server-only';
import type { Locale } from './config';

// We enumerate all dictionaries here for better linting and typescript support
// We do not want to use dynamic imports because it is not typesafe
const dictionaries = {
  en: {
    home: () => import('./en/home.json').then((module) => module.default),
    header: () => import('./en/header.json').then((module) => module.default),
  },
  es: {
    home: () => import('./es/home.json').then((module) => module.default),
    header: () => import('./es/header.json').then((module) => module.default),
  },
  // ca: ...
  // fr: ...
  // de: ...
  // nl: ...
};

// A helper function to get the correct dictionary based on the locale
// This is temporary, we will add more languages and modularize it better.
const getSection = async (locale: Locale, section: keyof (typeof dictionaries)['en']) => {
    switch(locale) {
        case 'en':
            return dictionaries.en[section]();
        case 'es':
            // Fallback to english if spanish translation is not available
            return dictionaries.es[section]?.() ?? dictionaries.en[section]();
        default:
            return dictionaries.en[section]();
    }
}

export const getDictionary = async (locale: Locale) => {
    return {
        home: await getSection(locale, 'home'),
        header: await getSection(locale, 'header'),
    }
}
