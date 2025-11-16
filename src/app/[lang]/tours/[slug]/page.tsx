
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
import { findAllHotels } from '@/app/server-actions/hotels/findHotels';
import { findAllMeetingPoints } from '@/app/server-actions/meeting-points/findMeetingPoints';

type TourPageProps = {
  params: {
    slug: string;
    lang: Locale;
  };
};

export async function generateStaticParams(): Promise<TourPageProps['params'][]> {
  const result = await findAllTours({});
  if (!result.data) {
    return [];
  }

  const paths = result.data
    .filter((tour: Tour) => tour.published) // Filter for published tours only
    .flatMap((tour: Tour) =>
      Object.entries(tour.slug)
        .filter(([_, slugValue]) => slugValue) 
        .map(([lang, slug]) => ({
          lang: lang as Locale,
          slug: encodeURIComponent(slug),
        }))
    );

  return paths;
}

export async function generateMetadata({ params }: TourPageProps): Promise<Metadata> {
  const { lang, slug: encodedSlug } = params;
  const slug = decodeURIComponent(encodedSlug);
  const tourResult = await findTourBySlugAndLang({ slug, lang });

  if (!tourResult.data) {
    return {
      title: 'Tour Not Found',
    };
  }

  const tour = tourResult.data;
  const title = tour.title[lang] || tour.title.en;
  const description = tour.description[lang] || tour.description.en;
  const imageUrl = tour.mainImage;

  const allSlugs = tour.slug;
  const languages: { [key: string]: string } = {};
  if (allSlugs.en) languages['en-US'] = `/en/tours/${encodeURIComponent(allSlugs.en)}`;
  if (allSlugs.de) languages['de-DE'] = `/de/tours/${encodeURIComponent(allSlugs.de)}`;
  if (allSlugs.fr) languages['fr-FR'] = `/fr/tours/${encodeURIComponent(allSlugs.fr)}`;
  if (allSlugs.nl) languages['nl-NL'] = `/nl/tours/${encodeURIComponent(allSlugs.nl)}`;


  return {
    title: title,
    description: description,
    openGraph: {
      title: title,
      description: description,
      images: [
        {
          url: imageUrl,
          width: 1200,
          height: 630,
          alt: title,
        },
      ],
      locale: lang,
      type: 'website',
    },
    twitter: {
      card: 'summary_large_image',
      title: title,
      description: description,
      images: [
        {
            url: imageUrl,
            width: 1200,
            height: 630,
            alt: title,
        }
      ],
    },
    alternates: {
        canonical: `/${lang}/tours/${slug}`,
        languages: languages,
    },
  };
}

export default async function TourPage({ params }: { params: { lang: Locale, slug: string } }) {
  const { lang, slug: encodedSlug } = params;
  const slug = decodeURIComponent(encodedSlug);
  
  // Fetch all necessary data in parallel
  const [
    dictionary, 
    tourResult, 
    hotelsResult, 
    meetingPointsResult
  ] = await Promise.all([
    getDictionary(lang),
    findTourBySlugAndLang({ slug, lang }),
    findAllHotels({}),
    findAllMeetingPoints({})
  ]);


  if (!tourResult.data) {
    notFound();
  }
  const tour = tourResult.data;
  
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

  const allImages = [tour.mainImage, ...tour.galleryImages];

  return (
    <div className="bg-background">
        <TourHeaderSection tour={tourHeaderProps} dictionary={dictionary.tourDetail.header} />
        <TourGallerySection images={allImages} />

        <main className="w-full md:w-[80vw] mx-auto px-4 py-16 grid grid-cols-1 lg:grid-cols-3 gap-12">
            <div className="lg:col-span-2 space-y-12">
              <TourOverviewSection overview={tourOverviewProps.overview} dictionary={dictionary.tourDetail.overview} />
              <TourInfoSection dictionary={dictionary.tourDetail.tourInfo} />
              <TourItinerarySection dictionary={tourItineraryProps} />
              <TourDetailsAccordion dictionary={tourDetailsProps} />
            </div>
            <aside className="lg:col-span-1">
              <TourBookingSection 
                dictionary={dictionary.tourDetail.booking} 
                tour={tour}
                lang={lang}
                hotels={hotelsResult.data || []}
                meetingPoints={meetingPointsResult.data || []}
              />
            </aside>
        </main>
    </div>
  );
}
