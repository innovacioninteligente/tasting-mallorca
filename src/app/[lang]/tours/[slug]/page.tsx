
'use server';

import { Suspense } from 'react';
import { notFound } from 'next/navigation';
import { Metadata } from 'next';
import { findAllTours, findTourBySlugAndLang } from '@/app/server-actions/tours/findTours';
import { findAllHotels } from '@/app/server-actions/hotels/findHotels';
import { findAllMeetingPoints } from '@/app/server-actions/meeting-points/findMeetingPoints';
import { getDictionary } from '@/dictionaries/get-dictionary';
import { Locale } from '@/dictionaries/config';
import { Tour } from '@/backend/tours/domain/tour.model';
import TourPageClient from './tour-page-client';
import { schemaBuilder } from '@/lib/seo/schema-builder';

type TourPageParams = {
  slug: string;
  lang: Locale;
};

export async function generateStaticParams(): Promise<TourPageParams[]> {
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
          slug: slug,
        }))
    );
  return paths;
}

export async function generateMetadata({ params }: { params: Promise<TourPageParams> }): Promise<Metadata> {
  const { lang, slug: encodedSlug } = await params;
  const slug = decodeURIComponent(encodedSlug);
  const tourResult = await findTourBySlugAndLang({ slug, lang });

  if (!tourResult.data) {
    return { title: 'Tour Not Found' };
  }
  const tour = tourResult.data;
  const title = tour.title[lang] || tour.title.en;
  const description = tour.description[lang] || tour.description.en;
  const imageUrl = tour.mainImage;
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
      images: [{ url: imageUrl, width: 1200, height: 630, alt: title }],
      locale: lang,
      type: 'website',
    },
    twitter: {
      card: 'summary_large_image',
      title: title,
      description: description,
      images: [{ url: imageUrl, width: 1200, height: 630, alt: title }],
    },
    alternates: {
      canonical: `/${lang}/tours/${slug}`,
      languages,
    },
  };
}

export default async function TourPageLoader({ params }: { params: Promise<TourPageParams> }) {
  const { lang, slug: encodedSlug } = await params;
  const slug = decodeURIComponent(encodedSlug);
  const [dictionary, tourResult, hotelsResult, meetingPointsResult, allToursResult] = await Promise.all([
    getDictionary(lang),
    findTourBySlugAndLang({ slug, lang }),
    findAllHotels({}),
    findAllMeetingPoints({}),
    findAllTours({}),
  ]);

  if (!tourResult.data) {
    notFound();
  }

  const otherTours = (allToursResult.data || [])
    .filter(t => t.id !== tourResult.data?.id && t.published)
    .slice(0, 3);

  return (
    <Suspense fallback={<div>Loading...</div>}>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify([
            schemaBuilder.generateTourSchema(tourResult.data, lang),
            schemaBuilder.generateFAQSchema([
              { question: dictionary.tourDetail?.booking?.pickupPoint || 'Meeting Point', answer: tourResult.data.generalInfo.pickupInfo[lang] || tourResult.data.generalInfo.pickupInfo.en },
              { question: dictionary.tourDetail?.tourDetails?.includesTitle || 'Included', answer: tourResult.data.details?.included?.[lang] || tourResult.data.details?.included?.en || '' },
            ])
          ])
        }}
      />
      <TourPageClient
        tour={tourResult.data}
        dictionary={dictionary}
        lang={lang}
        hotels={hotelsResult.data || []}
        meetingPoints={meetingPointsResult.data || []}
        relatedTours={otherTours}
      />
    </Suspense>
  );
}
