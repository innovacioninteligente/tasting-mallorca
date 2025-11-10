
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
import { findAllTours, findTourBySlugAndLang } from '@/app/server-actions/tours/findTours';
import { Tour } from '@/backend/tours/domain/tour.model';

type TourPageProps = {
  params: {
    slug: string;
    lang: Locale;
  };
};

// Phase 2: Generate static paths for all tours in all languages at build time
export async function generateStaticParams() {
  const result = await findAllTours({});
  if (!result.data) {
    return [];
  }

  const paths = result.data.flatMap((tour: Tour) =>
    Object.entries(tour.slug)
      .filter(([_, slugValue]) => slugValue) // Filter out empty slugs
      .map(([lang, slug]) => ({
        lang,
        slug,
      }))
  );

  return paths;
}

// Phase 2: Generate dynamic metadata for each tour page
export async function generateMetadata({ params }: TourPageProps): Promise<Metadata> {
  const tourResult = await findTourBySlugAndLang({ slug: params.slug, lang: params.lang });

  if (!tourResult.data) {
    return {
      title: 'Tour Not Found',
    };
  }

  const tour = tourResult.data;
  const title = tour.title[params.lang] || tour.title.en;
  const description = tour.description[params.lang] || tour.description.en;

  const allSlugs = tour.slug;
  const languages: { [key: string]: string } = {};
  if (allSlugs.en) languages['en-US'] = `/en/tours/${allSlugs.en}`;
  if (allSlugs.de) languages['de-DE'] = `/de/tours/${allSlugs.de}`;
  if (allSlugs.fr) languages['fr-FR'] = `/fr/tours/${allSlugs.fr}`;
  if (allSlugs.nl) languages['nl-NL'] = `/nl/tours/${allSlugs.nl}`;


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
        languages: languages,
    },
  };
}

export default async function TourPage({ params }: TourPageProps) {
  const { lang, slug } = params;
  const dictionary = await getDictionary(lang);
  
  const tourResult = await findTourBySlugAndLang({ slug, lang });

  if (!tourResult.data) {
    notFound();
  }
  const tour = tourResult.data;

  // Since tour data is now fully dynamic, we need to adapt the dictionary-based components.
  // For simplicity, we'll use the dictionary for static text and pass dynamic tour data directly.
  
  const tourHeaderProps = {
    title: tour.title[lang] || tour.title.en,
  };

  const tourOverviewProps = {
    overview: tour.overview[lang] || tour.overview.en,
  };
  
  // This is a simplified mapping. A more robust solution might involve a dedicated mapping layer.
  const tourDetailsProps = {
      highlightsTitle: dictionary.tourDetail.tourDetails.highlightsTitle,
      highlights: (tour.details?.highlights?.[lang] || tour.details?.highlights?.en || '').split('\n').filter(Boolean),
      detailTitle: dictionary.tourDetail.tourDetails.detailTitle,
      detailContent: (tour.details?.fullDescription?.[lang] || tour.details?.fullDescription?.en || '').split('\n').filter(Boolean),
      includesTitle: dictionary.tourDetail.tourDetails.includesTitle,
      included: (tour.details?.included?.[lang] || tour.details?.included?.en || '').split('\n').filter(Boolean),
      notIncluded: (tour.details?.notIncluded?.[lang] || tour.details?.notIncluded?.en || '').split('\n').filter(Boolean),
      importantInfoTitle: dictionary.tourDetail.tourDetails.importantInfoTitle,
      notSuitableTitle: dictionary.tourDetail.tourDetails.notSuitableTitle,
      notSuitableItems: (tour.details?.notSuitableFor?.[lang] || tour.details?.notSuitableFor?.en || '').split('\n').filter(Boolean),
      whatToBringTitle: dictionary.tourDetail.tourDetails.whatToBringTitle,
      whatToBringItems: (tour.details?.whatToBring?.[lang] || tour.details?.whatToBring?.en || '').split('\n').filter(Boolean),
      beforeYouGoTitle: dictionary.tourDetail.tourDetails.beforeYouGoTitle,
      beforeYouGoItems: (tour.details?.beforeYouGo?.[lang] || tour.details?.beforeYouGo?.en || '').split('\n').filter(Boolean),
  };
  
  const tourItineraryProps = {
      ...dictionary.tourDetail.itinerary,
      pickupTitle: tour.pickupPoint.title[lang] || tour.pickupPoint.title.en,
      pickupPoints: (tour.pickupPoint.description[lang] || tour.pickupPoint.description.en).split('\n').filter(Boolean),
      dropoffTitle: tour.pickupPoint.title[lang] || tour.pickupPoint.title.en,
      dropoffPoints: (tour.pickupPoint.description[lang] || tour.pickupPoint.description.en).split('\n').filter(Boolean),
      stops: tour.itinerary.map(item => ({
        type: item.type,
        icon: item.icon as any,
        title: item.title[lang] || item.title.en,
        duration: item.duration,
        activities: (item.activities as any)[lang] || item.activities.en || [],
      }))
  };

  return (
    <div className="bg-background">
        <TourHeaderSection tour={tourHeaderProps} dictionary={dictionary.tourDetail.header} />
        <TourGallerySection />

        <main className="w-full md:w-[90vw] mx-auto px-4 py-16 grid grid-cols-1 lg:grid-cols-3 gap-12">
            <div className="lg:col-span-2 space-y-12">
              <TourOverviewSection overview={tourOverviewProps.overview} dictionary={dictionary.tourDetail.overview} />
              <TourInfoSection dictionary={dictionary.tourDetail.tourInfo} />
              <TourItinerarySection dictionary={tourItineraryProps} />
              <TourDetailsAccordion dictionary={tourDetailsProps} />
            </div>
            <aside className="lg:col-span-1">
              <TourBookingSection 
                dictionary={dictionary.tourDetail.booking} 
                price={tour.price} 
                lang={params.lang} 
                tourTitle={tour.title[lang] || tour.title.en} 
              />
            </aside>
        </main>
    </div>
  );
}
