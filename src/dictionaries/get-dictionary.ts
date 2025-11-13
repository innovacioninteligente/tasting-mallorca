
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
    featuredTours: () => import('./en/featured-tours.json').then((module) => module.default),
    gallery: () => import('./en/gallery.json').then((module) => module.default),
    happyCustomers: () => import('./en/happy-customers.json').then((module) => module.default),
    destinations: () => import('./en/destinations.json').then((module) => module.default),
    tourGuides: () => import('./en/tour-guides.json').then((module) => module.default),
    testimonials: () => import('./en/testimonials.json').then((module) => module.default),
    blog: () => import('./en/blog.json').then((module) => module.default),
    privateTours: () => import('./en/private-tours.json').then((module) => module.default),
    privateToursCta: () => import('./en/private-tours-cta.json').then((module) => module.default),
    guestFeedback: () => import('./en/guest-feedback.json').then((module) => module.default),
    about: () => import('./en/about.json').then((module) => module.default),
    contact: () => import('./en/contact.json').then((module) => module.default),
    tourDetail: {
      header: () => import('./en/tour-detail/header.json').then(m => m.default),
      overview: () => import('./en/tour-detail/overview.json').then(m => m.default),
      tourInfo: () => import('./en/tour-detail/tour-info.json').then(m => m.default),
      tourDetails: () => import('./en/tour-detail/tour-details.json').then(m => m.default),
      itinerary: () => import('./en/tour-detail/itinerary.json').then(m => m.default),
      booking: () => import('./en/tour-detail/booking.json').then(m => m.default),
    },
    dashboard: {
      validationResult: () => import('./en/dashboard/validation-result.json').then(m => m.default),
    }
  },
  fr: {
    home: () => import('./fr/home.json').then((module) => module.default),
    header: () => import('./fr/header.json').then((module) => module.default),
    whatsIncluded: () => import('./fr/whats-included.json').then((module) => module.default),
    whyChooseUs: () => import('./fr/why-choose-us.json').then((module) => module.default),
    tours: () => import('./fr/tours.json').then((module) => module.default),
    featuredTours: () => import('./fr/featured-tours.json').then((module) => module.default),
    gallery: () => import('./fr/gallery.json').then((module) => module.default),
    happyCustomers: () => import('./fr/happy-customers.json').then((module) => module.default),
    destinations: () => import('./fr/destinations.json').then((module) => module.default),
    tourGuides: () => import('./fr/tour-guides.json').then((module) => module.default),
    testimonials: () => import('./fr/testimonials.json').then((module) => module.default),
    blog: () => import('./fr/blog.json').then((module) => module.default),
    privateTours: () => import('./fr/private-tours.json').then((module) => module.default),
    privateToursCta: () => import('./fr/private-tours-cta.json').then((module) => module.default),
    guestFeedback: () => import('./fr/guest-feedback.json').then((module) => module.default),
    about: () => import('./fr/about.json').then((module) => module.default),
    contact: () => import('./fr/contact.json').then((module) => module.default),
    tourDetail: {
      header: () => import('./fr/tour-detail/header.json').then(m => m.default),
      overview: () => import('./fr/tour-detail/overview.json').then(m => m.default),
      tourInfo: () => import('./fr/tour-detail/tour-info.json').then(m => m.default),
      tourDetails: () => import('./fr/tour-detail/tour-details.json').then(m => m.default),
      itinerary: () => import('./fr/tour-detail/itinerary.json').then(m => m.default),
      booking: () => import('./fr/tour-detail/booking.json').then(m => m.default),
    },
    dashboard: {
        validationResult: () => import('./fr/dashboard/validation-result.json').then(m => m.default),
    }
  },
  de: {
    home: () => import('./de/home.json').then((module) => module.default),
    header: () => import('./de/header.json').then((module) => module.default),
    whatsIncluded: () => import('./de/whats-included.json').then((module) => module.default),
    whyChooseUs: () => import('./de/why-choose-us.json').then((module) => module.default),
    tours: () => import('./de/tours.json').then((module) => module.default),
    featuredTours: () => import('./de/featured-tours.json').then((module) => module.default),
    gallery: () => import('./de/gallery.json').then((module) => module.default),
    happyCustomers: () => import('./de/happy-customers.json').then((module) => module.default),
    destinations: () => import('./de/destinations.json').then((module) => module.default),
    tourGuides: () => import('./de/tour-guides.json').then((module) => module.default),
    testimonials: () => import('./de/testimonials.json').then((module) => module.default),
    blog: () => import('./de/blog.json').then((module) => module.default),
    privateTours: () => import('./de/private-tours.json').then((module) => module.default),
    privateToursCta: () => import('./de/private-tours-cta.json').then((module) => module.default),
    guestFeedback: () => import('./de/guest-feedback.json').then((module) => module.default),
    about: () => import('./de/about.json').then((module) => module.default),
    contact: () => import('./de/contact.json').then((module) => module.default),
    tourDetail: {
      header: () => import('./de/tour-detail/header.json').then(m => m.default),
      overview: () => import('./de/tour-detail/overview.json').then(m => m.default),
      tourInfo: () => import('./de/tour-detail/tour-info.json').then(m => m.default),
      tourDetails: () => import('./de/tour-detail/tour-details.json').then(m => m.default),
      itinerary: () => import('./de/tour-detail/itinerary.json').then(m => m.default),
      booking: () => import('./de/tour-detail/booking.json').then(m => m.default),
    },
    dashboard: {
        validationResult: () => import('./de/dashboard/validation-result.json').then(m => m.default),
    }
  },
  nl: {
    home: () => import('./nl/home.json').then((module) => module.default),
    header: () => import('./nl/header.json').then((module) => module.default),
    whatsIncluded: () => import('./nl/whats-included.json').then((module) => module.default),
    whyChooseUs: () => import('./nl/why-choose-us.json').then((module) => module.default),
    tours: () => import('./nl/tours.json').then((module) => module.default),
    featuredTours: () => import('./nl/featured-tours.json').then((module) => module.default),
    gallery: () => import('./nl/gallery.json').then((module) => module.default),
    happyCustomers: () => import('./nl/happy-customers.json').then((module) => module.default),
    destinations: () => import('./nl/destinations.json').then((module) => module.default),
    tourGuides: () => import('./nl/tour-guides.json').then((module) => module.default),
    testimonials: () => import('./nl/testimonials.json').then((module) => module.default),
    blog: () => import('./nl/blog.json').then((module) => module.default),
    privateTours: () => import('./nl/private-tours.json').then((module) => module.default),
    privateToursCta: () => import('./nl/private-tours-cta.json').then((module) => module.default),
    guestFeedback: () => import('./nl/guest-feedback.json').then((module) => module.default),
    about: () => import('./nl/about.json').then((module) => module.default),
    contact: () => import('./nl/contact.json').then((module) => module.default),
    tourDetail: {
      header: () => import('./nl/tour-detail/header.json').then(m => m.default),
      overview: () => import('./nl/tour-detail/overview.json').then(m => m.default),
      tourInfo: () => import('./nl/tour-detail/tour-info.json').then(m => m.default),
      tourDetails: () => import('./nl/tour-detail/tour-details.json').then(m => m.default),
      itinerary: () => import('./nl/tour-detail/itinerary.json').then(m => m.default),
      booking: () => import('./nl/tour-detail/booking.json').then(m => m.default),
    },
    dashboard: {
        validationResult: () => import('./nl/dashboard/validation-result.json').then(m => m.default),
    }
  }
};

const loadDictionary = async (locale: Locale) => {
    const lang = dictionaries[locale] ?? dictionaries.en;
    const tourDetail = {
        header: await lang.tourDetail.header(),
        overview: await lang.tourDetail.overview(),
        tourInfo: await lang.tourDetail.tourInfo(),
        itinerary: await lang.tourDetail.itinerary(),
        booking: await lang.tourDetail.booking(),
        tourDetails: await lang.tourDetail.tourDetails(),
    };
    const dashboard = {
        validationResult: await lang.dashboard.validationResult(),
    };

    return {
        home: await lang.home(),
        header: await lang.header(),
        whatsIncluded: await lang.whatsIncluded(),
        whyChooseUs: await lang.whyChooseUs(),
        tours: await lang.tours(),
        featuredTours: await lang.featuredTours(),
        gallery: await lang.gallery(),
        happyCustomers: await lang.happyCustomers(),
        destinations: await lang.destinations(),
        tourGuides: await lang.tourGuides(),
        testimonials: await lang.testimonials(),
        blog: await lang.blog(),
        privateTours: await lang.privateTours(),
        privateToursCta: await lang.privateToursCta(),
        guestFeedback: await lang.guestFeedback(),
        about: await lang.about(),
        contact: await lang.contact(),
        tourDetail,
        dashboard,
    };
};

// Define a type for the dictionary
export type DictionaryType = Awaited<ReturnType<typeof loadDictionary>>;

// Cache the dictionaries
const dictionaryCache: { [key in Locale]?: DictionaryType } = {};

export const getDictionary = async (locale: Locale): Promise<DictionaryType> => {
  if (dictionaryCache[locale]) {
    return dictionaryCache[locale] as DictionaryType;
  }
  const dict = await loadDictionary(locale);
  dictionaryCache[locale] = dict;
  return dict;
};
