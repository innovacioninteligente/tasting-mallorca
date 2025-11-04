import 'server-only';
import type { Locale } from './config';

// We enumerate all dictionaries here for better linting and typescript support
// We do not want to use dynamic imports because it is not typesafe
const dictionaries = {
  en: {
    home: () => import('./en/home.json').then((module) => module.default),
    header: () => import('./en/header.json').then((module) => module.default),
    whatsIncluded: () => import('./en/whats-included.json').then((module) => module.default),
    whyChooseUs: () => import('./en/why-choose-us.json').then((module) => module.default),
  },
  es: {
    home: () => import('./es/home.json').then((module) => module.default),
    header: () => import('./es/header.json').then((module) => module.default),
    whatsIncluded: () => import('./es/whats-included.json').then((module) => module.default),
    whyChooseUs: () => import('./es/why-choose-us.json').then((module) => module.default),
  },
  ca: {
    home: () => import('./ca/home.json').then((module) => module.default),
    header: () => import('./ca/header.json').then((module) => module.default),
    whatsIncluded: () => import('./ca/whats-included.json').then((module) => module.default),
    whyChooseUs: () => import('./ca/why-choose-us.json').then((module) => module.default),
  },
  fr: {
    home: () => import('./fr/home.json').then((module) => module.default),
    header: () => import('./fr/header.json').then((module) => module.default),
    whatsIncluded: () => import('./fr/whats-included.json').then((module) => module.default),
    whyChooseUs: () => import('./fr/why-choose-us.json').then((module) => module.default),
  },
  de: {
    home: () => import('./de/home.json').then((module) => module.default),
    header: () => import('./de/header.json').then((module) => module.default),
    whatsIncluded: () => import('./de/whats-included.json').then((module) => module.default),
    whyChooseUs: () => import('./de/why-choose-us.json').then((module) => module.default),
  },
  nl: {
    home: () => import('./nl/home.json').then((module) => module.default),
    header: () => import('./nl/header.json').then((module) => module.default),
    whatsIncluded: () => import('./nl/whats-included.json').then((module) => module.default),
    whyChooseUs: () => import('./nl/why-choose-us.json').then((module) => module.default),
  },
};

export const getDictionary = async (locale: Locale) => {
  const lang = dictionaries[locale] ?? dictionaries.en;
  
  return {
    home: await lang.home(),
    header: await lang.header(),
    whatsIncluded: await lang.whatsIncluded(),
    whyChooseUs: await lang.whyChooseUs(),
  };
}
