
import { getDictionary } from '@/dictionaries/get-dictionary';
import { Locale } from '@/dictionaries/config';
import HomeClientPage from '@/app/[lang]/home-client-page';
import { findAllTours } from '../server-actions/tours/findTours';
import { Tour } from '@/backend/tours/domain/tour.model';

export default async function Page({ params }: { params: { lang: Locale } }) {
  const dictionary = await getDictionary(params.lang);
  const toursResult = await findAllTours({});
  const tours = toursResult.data || [];

  return <HomeClientPage dictionary={dictionary} lang={params.lang} tours={tours as Tour[]} />;
}
