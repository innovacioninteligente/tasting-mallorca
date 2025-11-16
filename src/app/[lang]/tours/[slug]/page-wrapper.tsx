
import React from 'react';
import { notFound } from 'next/navigation';
import { Locale } from '@/dictionaries/config';
import { getDictionary } from '@/dictionaries/get-dictionary';
import { Metadata } from 'next';
import { findAllTours, findTourBySlugAndLang } from '@/app/server-actions/tours/findTours';
import { Tour } from '@/backend/tours/domain/tour.model';
import { findAllHotels } from '@/app/server-actions/hotels/findHotels';
import { findAllMeetingPoints } from '@/app/server-actions/meeting-points/findMeetingPoints';
import TourPage from './page';

type TourPageWrapperProps = {
  params: {
    slug: string;
    lang: Locale;
  };
};

export async function generateStaticParams(): Promise<TourPageWrapperProps['params'][]> {
  const result = await findAllTours({});
  if (!result.data) {
    return [];
  }

  const paths = result.data
    .filter((tour: Tour) => tour.published)
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

export async function generateMetadata({ params }: TourPageWrapperProps): Promise<Metadata> {
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

export default async function TourPageWrapper({ params }: { params: { lang: Locale, slug: string } }) {
  const { lang, slug: encodedSlug } = params;
  const slug = decodeURIComponent(encodedSlug);
  
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

  return (
    <TourPage
      tour={tourResult.data}
      dictionary={dictionary}
      lang={lang}
      hotels={hotelsResult.data || []}
      meetingPoints={meetingPointsResult.data || []}
    />
  );
}
