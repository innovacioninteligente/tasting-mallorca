import Image from 'next/image';
import { tours } from '@/lib/tours-data';
import { notFound } from 'next/navigation';
import { Locale } from '@/dictionaries/config';

type TourPageProps = {
  params: {
    slug: string;
    lang: Locale;
  };
};

export default function TourPage({ params }: TourPageProps) {
  const tour = tours.find((t) => t.slug === params.slug);

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
          className="object-cover"
          priority
          style={{ viewTransitionName: `tour-image-${tour.slug}` }}
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
