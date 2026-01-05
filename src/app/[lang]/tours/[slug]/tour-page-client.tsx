'use client';

import React, { useEffect, useRef } from 'react';
import { notFound } from 'next/navigation';
import { Locale } from '@/dictionaries/config';
import { TourHeaderSection } from '@/components/tours/tour-header-section';
import { TourGallerySection } from '@/components/tours/tour-gallery-section';
import { TourInfoSection } from '@/components/tours/tour-info-section';
// import { TourItinerarySection } from '@/components/tours/tour-itinerary-section'; // Removed
import { TourBookingSection } from '@/components/tours/tour-booking-section';
import { TourOverviewSection } from '@/components/tours/tour-overview-section';
import { TourDetailsAccordion } from '@/components/tours/tour-details-accordion';
import { Tour } from '@/backend/tours/domain/tour.model';
import { Hotel } from '@/backend/hotels/domain/hotel.model';
import { MeetingPoint } from '@/backend/meeting-points/domain/meeting-point.model';
import { useAlternateLinks } from '@/context/alternate-links-context';
import { RelatedToursSection } from '@/components/tours/related-tours-section';
import { DictionaryType } from '@/dictionaries/get-dictionary';
import { VisualItinerary } from '@/components/tours/visual-itinerary';
import { TrustSignals } from '@/components/tours/trust-signals';


type TourPageProps = {
  tour: Tour | null;
  dictionary: DictionaryType;
  lang: Locale;
  hotels: Hotel[];
  meetingPoints: MeetingPoint[];
  relatedTours: Tour[];
};

export default function TourPageClient({ tour, dictionary, lang, hotels, meetingPoints, relatedTours }: TourPageProps) {
  const { setAlternateLinks } = useAlternateLinks();
  const bookingRef = useRef<HTMLElement>(null);

  useEffect(() => {
    if (tour) {
      const allSlugs = tour.slug;
      const languages: { [key: string]: string } = {};
      if (allSlugs.en) languages['en'] = `/en/tours/${allSlugs.en}`;
      if (allSlugs.de) languages['de'] = `/de/tours/${allSlugs.de}`;
      if (allSlugs.fr) languages['fr'] = `/fr/tours/${allSlugs.fr}`;
      if (allSlugs.nl) languages['nl'] = `/nl/tours/${allSlugs.nl}`;
      setAlternateLinks(languages);

      // Trigger view_item event
      if (typeof window !== 'undefined' && window.dataLayer) {
        window.dataLayer.push({
          event: 'view_item',
          ecommerce: {
            currency: 'EUR',
            value: tour.price,
            items: [{
              item_id: tour.id,
              item_name: tour.title[lang] || tour.title.en,
              price: tour.price,
              quantity: 1
            }]
          }
        });
      }
    }

    // Cleanup function to reset links when component unmounts
    return () => setAlternateLinks({});
  }, [tour, setAlternateLinks, lang]);

  if (!tour) {
    notFound();
  }

  const handleBookClick = () => {
    bookingRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const tourHeaderProps = {
    title: tour.title[lang] || tour.title.en,
  };

  const tourOverviewProps = {
    overview: tour.overview[lang] || tour.overview.en,
  };

  const tourDetailsProps = {
    highlightsTitle: dictionary.tourDetail.tourDetails.highlightsTitle,
    highlights: (tour.details?.highlights?.[lang as keyof typeof tour.details.highlights] || tour.details?.highlights?.en || '').split('\n').filter(Boolean),
    detailTitle: dictionary.tourDetail.tourDetails.detailTitle,
    detailContent: (tour.details?.fullDescription?.[lang as keyof typeof tour.details.fullDescription] || tour.details?.fullDescription?.en || '').split('\n').filter(Boolean),
    includesTitle: dictionary.tourDetail.tourDetails.includesTitle,
    included: (tour.details?.included?.[lang as keyof typeof tour.details.included] || tour.details?.included?.en || '').split('\n').filter(Boolean),
    notIncluded: (tour.details?.notIncluded?.[lang as keyof typeof tour.details.notIncluded] || tour.details?.notIncluded?.en || '').split('\n').filter(Boolean),
    importantInfoTitle: dictionary.tourDetail.tourDetails.importantInfoTitle,
    notSuitableTitle: dictionary.tourDetail.tourDetails.notSuitableTitle,
    notSuitableItems: (tour.details?.notSuitableFor?.[lang as keyof typeof tour.details.notSuitableFor] || tour.details?.notSuitableFor?.en || '').split('\n').filter(Boolean),
    whatToBringTitle: dictionary.tourDetail.tourDetails.whatToBringTitle,
    whatToBringItems: (tour.details?.whatToBring?.[lang as keyof typeof tour.details.whatToBring] || tour.details?.whatToBring?.en || '').split('\n').filter(Boolean),
    beforeYouGoTitle: dictionary.tourDetail.tourDetails.beforeYouGoTitle,
    beforeYouGoItems: (tour.details?.beforeYouGo?.[lang as keyof typeof tour.details.beforeYouGo] || tour.details?.beforeYouGo?.en || '').split('\n').filter(Boolean),
  };

  const allImages = [tour.mainImage, ...tour.galleryImages];

  return (
    <div className="bg-background relative">
      <TourHeaderSection tour={tourHeaderProps} dictionary={dictionary.tourDetail.header} />
      <TourGallerySection images={allImages} />

      <main className="w-full xl:w-[90vw] 2xl:w-[80vw] mx-auto px-4 py-8 md:py-16 grid grid-cols-1 lg:grid-cols-5 gap-12">
        <div className="lg:col-span-3 space-y-12">
          {/* Mobile Booking Trigger (Visible only on mobile inside flow if needed, but we have the sticky bar) */}

          <TourOverviewSection overview={tourOverviewProps.overview} dictionary={dictionary.tourDetail.overview} />

          <TourInfoSection dictionary={{
            ...dictionary.tourDetail.tourInfo,
            infoPoints: dictionary.tourDetail.tourInfo.infoPoints.map(point => ({
              ...point,
              icon: point.icon as any
            }))
          }} />

          {/* Visual Itinerary Replacement */}
          <div className="space-y-6">
            <h2 className="text-2xl font-bold font-cursive text-primary">{dictionary.tourDetail.itinerary.title}</h2>
            <VisualItinerary tour={tour} lang={lang} />
          </div>

          <TourDetailsAccordion dictionary={tourDetailsProps} />
        </div>

        <aside className="lg:col-span-2" id="booking-section" ref={bookingRef}>
          <div className="sticky top-24 space-y-6">
            <TourBookingSection
              dictionary={dictionary.tourDetail.booking}
              tour={tour}
              lang={lang}
              hotels={hotels || []}
              meetingPoints={meetingPoints || []}
            />
            <TrustSignals />
          </div>
        </aside>

        <RelatedToursSection
          title={dictionary.featuredTours.title || 'You might also like'}
          lang={lang}
          tours={relatedTours}
        />

      </main>



    </div>
  );
}
