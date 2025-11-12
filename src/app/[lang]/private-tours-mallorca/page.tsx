
import { Metadata } from 'next';
import Image from 'next/image';
import { PrivateTourForm } from './private-tour-form';
import { getDictionary } from '@/dictionaries/get-dictionary';
import { Locale } from '@/dictionaries/config';

interface PageProps {
  params: {
    lang: Locale;
  };
}

export async function generateMetadata({ params: { lang } }: PageProps): Promise<Metadata> {
    const dictionary = await getDictionary(lang);
    const { pageTitle, pageDescription } = dictionary.privateTours;

    return {
        title: pageTitle,
        description: pageDescription,
    };
}


export default async function PrivateToursPage({ params: { lang } }: PageProps) {
  const dictionary = await getDictionary(lang);
  const { pageTitle, pageDescription } = dictionary.privateTours;
  const titleParts = pageTitle.split('–');

  return (
    <div className="bg-background text-foreground">
      <div className="container mx-auto px-4 py-16">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
          <div className="order-2 lg:order-1">
            <div className="max-w-xl">
              <h1 className="text-4xl md:text-5xl font-extrabold font-headline">
                {titleParts[0]} 
                {titleParts[1] && (
                  <span className="text-accent">–{titleParts[1]}</span>
                )}
              </h1>
              <p className="mt-6 text-lg text-muted-foreground">
                {pageDescription}
              </p>
            </div>
            <div className="mt-12">
              <PrivateTourForm dictionary={dictionary.privateTours.form} />
            </div>
          </div>
          <div className="order-1 lg:order-2 h-[400px] lg:h-[600px] relative rounded-2xl overflow-hidden">
            <Image
              src="https://picsum.photos/seed/private-tour/600/800"
              alt="Scenic view of Mallorca"
              fill
              className="object-cover"
              data-ai-hint="mallorca landscape scenic"
            />
             <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent"></div>
          </div>
        </div>
      </div>
    </div>
  );
}
