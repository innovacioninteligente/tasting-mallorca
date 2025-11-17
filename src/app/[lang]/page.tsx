
import { getDictionary } from '@/dictionaries/get-dictionary';
import { Locale } from '@/dictionaries/config';
import HomeClientPage from '@/app/[lang]/home-client-page';
import { findAllTours } from '../server-actions/tours/findTours';
import { findAllBlogPosts } from '../server-actions/blog/findBlogPosts';
import { Tour } from '@/backend/tours/domain/tour.model';
import { BlogPost } from '@/backend/blog/domain/blog.model';
import { Metadata } from 'next';

interface PageProps {
  params: {
    lang: Locale;
  };
}

export async function generateMetadata({ params: { lang } }: PageProps): Promise<Metadata> {
    const dictionary = await getDictionary(lang);
    const { title, subtitle } = dictionary.home;
    const imageUrl = "https://firebasestorage.googleapis.com/v0/b/tasting-mallorca.firebasestorage.app/o/web%2Fimages%2F036.PNG?alt=media&token=00e634e2-716f-495d-807e-5c15dfe2ea09";

    return {
        title: 'Tasting Mallorca | Authentic Food & Culture Tours',
        description: subtitle,
         openGraph: {
            title: 'Tasting Mallorca | Authentic Food & Culture Tours',
            description: subtitle,
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
            title: 'Tasting Mallorca | Authentic Food & Culture Tours',
            description: subtitle,
            images: [imageUrl],
        },
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
