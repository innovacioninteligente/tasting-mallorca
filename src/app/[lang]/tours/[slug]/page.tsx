
import React from 'react';
import { notFound } from 'next/navigation';
import { Locale } from '@/dictionaries/config';
import { getDictionary } from '@/dictionaries/get-dictionary';
import { Metadata } from 'next';
import { TourHeaderSection } from '@/components/tours/tour-header-section';
import { TourGallerySection } from '@/components/tours/tour-gallery-section';
import { TourInfoSection } from '@/components/tours/tour-info-section';
import { TourItinerarySection } from '@/components/tours/tour-itinerary-section';
import { TourBookingSection } from '@/components/tours/tour-booking-section';
import { TourOverviewSection } from '@/components/tours/tour-overview-section';
import { TourDetailsAccordion } from '@/components/tours/tour-details-accordion';
import { findTourBySlugAndLang } from '@/app/server-actions/tours/findTours';


type TourPageProps = {
  params: {
    slug: string;
    lang: Locale;
  };
};

export async function generateMetadata({ params }: TourPageProps): Promise<Metadata> {
  const result = await findTourBySlugAndLang({ slug: params.slug, lang: params.lang });
  const tour = result.data;

  if (result.error || !tour) {
    return {
      title: 'Tour Not Found',
    };
  }

  const title = tour.title[params.lang] || tour.title.en;
  const description = tour.description[params.lang] || tour.description.en;

  return {
    title: title,
    description: description,
    openGraph: {
      title: title,
      description: description,
      images: [
        {
          url: tour.mainImage,
          width: 1200,
          height: 630,
          alt: title,
        },
      ],
      locale: params.lang,
      type: 'website',
    },
    twitter: {
      card: 'summary_large_image',
      title: title,
      description: description,
      images: [tour.mainImage],
    },
    alternates: {
        canonical: `/${params.lang}/tours/${params.slug}`,
        languages: {
            'en': `/en/tours/${tour.slug.en}`,
            'es': `/es/tours/${tour.slug.es}`,
            'de': `/de/tours/${tour.slug.de}`,
            'fr': `/fr/tours/${tour.slug.fr}`,
            'nl': `/nl/tours/${tour.slug.nl}`,
            'x-default': `/en/tours/${tour.slug.en}`,
        },
    },
  };
}

export default async function TourPage({ params }: TourPageProps) {
  const dictionary = await getDictionary(params.lang);
  const tourResult = await findTourBySlugAndLang({ slug: params.slug, lang: params.lang });
  
  if (tourResult.error || !tourResult.data) {
    notFound();
  }

  const tour = tourResult.data;
  const tourDict = dictionary.tourDetail;

  const currentLangTour = {
    title: tour.title[params.lang] || tour.title.en,
    description: tour.description[params.lang] || tour.description.en,
    overview: tour.overview[params.lang] || tour.overview.en,
    price: tour.price,
  };


  return (
    <div className="bg-background">
        <TourHeaderSection tour={currentLangTour} dictionary={tourDict.header} />
        <TourGallerySection />

        <main className="w-full md:w-[90vw] mx-auto px-4 py-16 grid grid-cols-1 lg:grid-cols-3 gap-12">
            <div className="lg:col-span-2 space-y-12">
              <TourOverviewSection overview={currentLangTour.overview} dictionary={tourDict.overview} />
              <TourInfoSection dictionary={tourDict.tourInfo} />
              <TourItinerarySection dictionary={tourDict.itinerary} />
              <TourDetailsAccordion dictionary={tourDict.tourDetails} />
            </div>
            <aside className="lg:col-span-1">
              <TourBookingSection dictionary={tourDict.booking} price={tour.price} lang={params.lang} tourTitle={currentLangTour.title} />
            </aside>
        </main>
    </div>
  );
}
