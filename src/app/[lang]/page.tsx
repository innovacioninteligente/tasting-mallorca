
import { getDictionary } from '@/dictionaries/get-dictionary';
import { Locale } from '@/dictionaries/config';
import HomeClientPage from '@/app/[lang]/home-client-page';
import { findAllTours } from '../server-actions/tours/findTours';
import { findAllBlogPosts } from '../server-actions/blog/findBlogPosts';
import { Tour } from '@/backend/tours/domain/tour.model';
import { BlogPost } from '@/backend/blog/domain/blog.model';

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

  const postsResult = await findAllBlogPosts({});
  const posts = (postsResult.data || []).filter(p => p.published).slice(0, 3) as BlogPost[];

  return <HomeClientPage dictionary={dictionary} lang={lang} tours={tours as Tour[]} posts={posts} />;
}
