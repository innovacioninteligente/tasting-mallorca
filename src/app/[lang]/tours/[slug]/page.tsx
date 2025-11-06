
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


type TourPageProps = {
  params: {
    slug: string;
    lang: Locale;
  };
};

export async function generateMetadata({ params }: TourPageProps): Promise<Metadata> {
  const dictionary = await getDictionary(params.lang);
  const tour = dictionary.tours.find((t) => t.slug === params.slug);

  if (!tour) {
    return {
      title: 'Tour Not Found',
    };
  }

  return {
    title: tour.title,
    description: tour.description,
  };
}

export default async function TourPage({ params }: TourPageProps) {
  const dictionary = await getDictionary(params.lang);
  const tour = dictionary.tours.find((t) => t.slug === params.slug);
  const tourDict = dictionary.tourDetail;

  if (!tour) {
    notFound();
  }

  return (
    <div className="bg-background">
        <TourHeaderSection tour={tour} dictionary={tourDict.header} />
        <TourGallerySection />

        <main className="w-full md:w-[90vw] mx-auto px-4 py-16 grid grid-cols-1 lg:grid-cols-3 gap-12">
            <div className="lg:col-span-2 space-y-12">
              <TourOverviewSection dictionary={tourDict.overview} />
              <TourInfoSection dictionary={tourDict.tourInfo} />
              <TourItinerarySection dictionary={tourDict.itinerary} />
              <TourDetailsAccordion dictionary={tourDict.tourDetails} />
            </div>
            <aside className="lg:col-span-1">
              <TourBookingSection dictionary={tourDict.booking} price={tour.price} lang={params.lang} tourTitle={tour.title} />
            </aside>
        </main>
    </div>
  );
}
