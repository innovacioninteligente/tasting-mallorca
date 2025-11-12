
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

    return {
        title: pageTitle,
        description: pageDescription,
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
