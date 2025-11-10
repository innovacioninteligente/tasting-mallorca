

import { getDictionary } from '@/dictionaries/get-dictionary';
import { Locale } from '@/dictionaries/config';
import HomeClientPage from '@/app/[lang]/home-client-page';
import { findAllTours } from '../server-actions/tours/findTours';
import { Tour } from '@/backend/tours/domain/tour.model';

interface PageProps {
  params: {
    lang: Locale;
  };
}

export default async function Page({ params }: PageProps) {
  const { lang } = params;
  const dictionary = await getDictionary(lang);
  const toursResult = await findAllTours({});
  const tours = toursResult.data || [];

  return <HomeClientPage dictionary={dictionary} lang={lang} tours={tours as Tour[]} />;
}
