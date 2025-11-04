
import Image from 'next/image';
import { notFound } from 'next/navigation';
import { Locale } from '@/dictionaries/config';
import { getDictionary } from '@/dictionaries/get-dictionary';
import { Metadata } from 'next';

type TourPageProps = {
  params: {
    slug: string;
    lang: Locale;
  };
};

export async function generateMetadata({ params }: TourPageProps): Promise<Metadata> {
  const dictionary = await getDictionary(params.lang);
  const tour = dictionary.tours.find((t) => t.slug === params.slug);

  if (!tour) {
    return {
      title: 'Tour Not Found',
    };
  }

  return {
    title: tour.title,
    description: tour.description,
  };
}


export default async function TourPage({ params }: TourPageProps) {
  const dictionary = await getDictionary(params.lang);
  const tour = dictionary.tours.find((t) => t.slug === params.slug);

  if (!tour) {
    notFound();
  }

  return (
    <div>
      <header className="relative h-[60vh] w-full">
        <Image
          src={tour.image}
          alt={tour.title}
          fill
          className="object-cover view-transition"
          priority
          style={{ '--view-transition-name': `tour-image-${tour.slug}` } as React.CSSProperties}
        />
        <div className="absolute inset-0 bg-black/30" />
        <div className="absolute inset-0 flex items-center justify-center">
            <h1 className="text-4xl md:text-6xl font-extrabold text-white text-center">
                {tour.title}
            </h1>
        </div>
      </header>

      <main className="container mx-auto py-16">
        <p className="text-lg text-muted-foreground">{tour.description}</p>
        {/* More tour details will go here in future steps */}
      </main>
    </div>
  );
}
