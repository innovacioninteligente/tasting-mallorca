
import { Metadata } from 'next';
import { getDictionary } from '@/dictionaries/get-dictionary';
import { Locale } from '@/dictionaries/config';
import { FeedbackForm } from './feedback-form';
import { MessageSquareHeart } from 'lucide-react';

interface PageProps {
  params: {
    lang: Locale;
  };
}

export async function generateMetadata({ params: { lang } }: PageProps): Promise<Metadata> {
    const dictionary = await getDictionary(lang);
    const { pageTitle, pageDescription } = dictionary.guestFeedback;
    const imageUrl = "https://firebasestorage.googleapis.com/v0/b/tasting-mallorca.firebasestorage.app/o/web%2Fimages%2F036.PNG?alt=media&token=00e634e2-716f-495d-807e-5c15dfe2ea09";


    return {
        title: `${pageTitle} | Tasting Mallorca`,
        description: pageDescription,
         openGraph: {
            title: `${pageTitle} | Tasting Mallorca`,
            description: pageDescription,
            images: [
                {
                    url: imageUrl,
                    width: 1200,
                    height: 630,
                    alt: pageTitle,
                },
            ],
            locale: lang,
            type: 'website',
        },
        twitter: {
            card: 'summary_large_image',
            title: `${pageTitle} | Tasting Mallorca`,
            description: pageDescription,
            images: [imageUrl],
        },
    };
}


export default async function GuestFeedbackPage({ params: { lang } }: PageProps) {
  const dictionary = await getDictionary(lang);
  const { pageTitle, pageDescription } = dictionary.guestFeedback;
  
  return (
    <div className="bg-background text-foreground">
      <div className="container mx-auto px-4 py-16">
        <div className="text-center mb-12">
          <MessageSquareHeart className="mx-auto h-16 w-16 text-primary mb-4" />
          <h1 className="text-5xl md:text-6xl font-bold font-headline">{pageTitle}</h1>
          <p className="mt-4 text-xl text-muted-foreground max-w-3xl mx-auto">
            {pageDescription}
          </p>
        </div>
        <FeedbackForm dictionary={dictionary.guestFeedback.form} />
      </div>
    </div>
  );
}
