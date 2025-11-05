
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
    tours: () => import('./en/tours.json').then((module) => module.default),
    tourDetail: {
      header: () => import('./en/tour-detail/header.json').then(m => m.default),
      overview: () => import('./en/tour-detail/overview.json').then(m => m.default),
      tourInfo: () => import('./en/tour-detail/tour-info.json').then(m => m.default),
      highlights: () => import('./en/tour-detail/highlights.json').then(m => m.default),
      includes: () => import('./en/tour-detail/includes.json').then(m => m.default),
      itinerary: () => import('./en/tour-detail/itinerary.json').then(m => m.default),
      booking: () => import('./en/tour-detail/booking.json').then(m => m.default),
    }
  },
  es: {
    home: () => import('./es/home.json').then((module) => module.default),
    header: () => import('./es/header.json').then((module) => module.default),
    whatsIncluded: () => import('./es/whats-included.json').then((module) => module.default),
    whyChooseUs: () => import('./es/why-choose-us.json').then((module) => module.default),
    tours: () => import('./es/tours.json').then((module) => module.default),
    tourDetail: {
      header: () => import('./es/tour-detail/header.json').then(m => m.default),
      overview: () => import('./es/tour-detail/overview.json').then(m => m.default),
      tourInfo: () => import('./es/tour-detail/tour-info.json').then(m => m.default),
      highlights: () => import('./es/tour-detail/highlights.json').then(m => m.default),
      includes: () => import('./es/tour-detail/includes.json').then(m => m.default),
      itinerary: () => import('./es/tour-detail/itinerary.json').then(m => m.default),
      booking: () => import('./es/tour-detail/booking.json').then(m => m.default),
    }
  },
  ca: {
    home: () => import('./ca/home.json').then((module) => module.default),
    header: () => import('./ca/header.json').then((module) => module.default),
    whatsIncluded: () => import('./ca/whats-included.json').then((module) => module.default),
    whyChooseUs: () => import('./ca/why-choose-us.json').then((module) => module.default),
    tours: () => import('./ca/tours.json').then((module) => module.default),
    tourDetail: {
      header: () => import('./ca/tour-detail/header.json').then(m => m.default),
      overview: () => import('./ca/tour-detail/overview.json').then(m => m.default),
      tourInfo: () => import('./ca/tour-detail/tour-info.json').then(m => m.default),
      highlights: () => import('./ca/tour-detail/highlights.json').then(m => m.default),
      includes: () => import('./ca/tour-detail/includes.json').then(m => m.default),
      itinerary: () => import('./ca/tour-detail/itinerary.json').then(m => m.default),
      booking: () => import('./ca/tour-detail/booking.json').then(m => m.default),
    }
  },
  fr: {
    home: () => import('./fr/home.json').then((module) => module.default),
    header: () => import('./fr/header.json').then((module) => module.default),
    whatsIncluded: () => import('./fr/whats-included.json').then((module) => module.default),
    whyChooseUs: () => import('./fr/why-choose-us.json').then((module) => module.default),
    tours: () => import('./fr/tours.json').then((module) => module.default),
    tourDetail: {
      header: () => import('./fr/tour-detail/header.json').then(m => m.default),
      overview: () => import('./fr/tour-detail/overview.json').then(m => m.default),
      tourInfo: () => import('./fr/tour-detail/tour-info.json').then(m => m.default),
      highlights: () => import('./fr/tour-detail/highlights.json').then(m => m.default),
      includes: () => import('./fr/tour-detail/includes.json').then(m => m.default),
      itinerary: () => import('./fr/tour-detail/itinerary.json').then(m => m.default),
      booking: () => import('./fr/tour-detail/booking.json').then(m => m.default),
    }
  },
  de: {
    home: () => import('./de/home.json').then((module) => module.default),
    header: () => import('./de/header.json').then((module) => module.default),
    whatsIncluded: () => import('./de/whats-included.json').then((module) => module.default),
    whyChooseUs: () => import('./de/why-choose-us.json').then((module) => module.default),
    tours: () => import('./de/tours.json').then((module) => module.default),
    tourDetail: {
      header: () => import('./de/tour-detail/header.json').then(m => m.default),
      overview: () => import('./de/tour-detail/overview.json').then(m => m.default),
      tourInfo: () => import('./de/tour-detail/tour-info.json').then(m => m.default),
      highlights: () => import('./de/tour-detail/highlights.json').then(m => m.default),
      includes: () => import('./de/tour-detail/includes.json').then(m => m.default),
      itinerary: () => import('./de/tour-detail/itinerary.json').then(m => m.default),
      booking: () => import('./de/tour-detail/booking.json').then(m => m.default),
    }
  },
  nl: {
    home: () => import('./nl/home.json').then((module) => module.default),
    header: () => import('./nl/header.json').then((module) => module.default),
    whatsIncluded: () => import('./nl/whats-included.json').then((module) => module.default),
    whyChooseUs: () => import('./nl/why-choose-us.json').then((module) => module.default),
    tours: () => import('./nl/tours.json').then((module) => module.default),
    tourDetail: {
      header: () => import('./nl/tour-detail/header.json').then(m => m.default),
      overview: () => import('./nl/tour-detail/overview.json').then(m => m.default),
      tourInfo: () => import('./nl/tour-detail/tour-info.json').then(m => m.default),
      highlights: () => import('./nl/tour-detail/highlights.json').then(m => m.default),
      includes: () => import('./nl/tour-detail/includes.json').then(m => m.default),
      itinerary: () => import('./nl/tour-detail/itinerary.json').then(m => m.default),
      booking: () => import('./nl/tour-detail/booking.json').then(m => m.default),
    }
  },
};

export const getDictionary = async (locale: Locale) => {
  const lang = dictionaries[locale] ?? dictionaries.en;
  
  return {
    home: await lang.home(),
    header: await lang.header(),
    whatsIncluded: await lang.whatsIncluded(),
    whyChooseUs: await lang.whyChooseUs(),
    tours: await lang.tours(),
    tourDetail: {
      header: await lang.tourDetail.header(),
      overview: await lang.tourDetail.overview(),
      tourInfo: await lang.tourDetail.tourInfo(),
      highlights: await lang.tourDetail.highlights(),
      includes: await lang.tourDetail.includes(),
      itinerary: await lang.tourDetail.itinerary(),
      booking: await lang.tourDetail.booking(),
    }
  };
}
