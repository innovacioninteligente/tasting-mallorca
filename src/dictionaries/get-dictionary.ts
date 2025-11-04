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
  ca: {
    home: () => import('./ca/home.json').then((module) => module.default),
    header: () => import('./en/header.json').then((module) => module.default), // Fallback for now
  },
  fr: {
    home: () => import('./fr/home.json').then((module) => module.default),
    header: () => import('./en/header.json').then((module) => module.default), // Fallback for now
  },
  de: {
    home: () => import('./de/home.json').then((module) => module.default),
    header: () => import('./en/header.json').then((module) => module.default), // Fallback for now
  },
  nl: {
    home: () => import('./nl/home.json').then((module) => module.default),
    header: () => import('./en/header.json').then((module) => module.default), // Fallback for now
  },
};

type Dictionaries = typeof dictionaries;
type DictionarySections = keyof Dictionaries['en'];

// A helper function to get the correct dictionary based on the locale
const getSection = async <T extends DictionarySections>(locale: Locale, section: T): Promise<Awaited<ReturnType<Dictionaries[Locale][T]>>> => {
    const langDict = dictionaries[locale] ?? dictionaries.en;
    const modLoader = langDict[section] ?? dictionaries.en[section];
    return await modLoader();
}

export const getDictionary = async (locale: Locale) => {
    return {
        home: await getSection(locale, 'home'),
        header: await getSection(locale, 'header'),
    }
}
