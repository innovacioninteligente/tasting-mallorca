
'use client';

import { type Locale } from '@/dictionaries/config';
import { type getDictionary } from '@/dictionaries/get-dictionary';
import { Tour } from '@/backend/tours/domain/tour.model';
import { TourCard } from '../tour-card';

type FeaturedToursProps = {
    dictionary: Awaited<ReturnType<typeof getDictionary>>['featuredTours'];
    lang: Locale;
    tours: Tour[];
}

export function FeaturedToursSection({ dictionary, lang, tours }: FeaturedToursProps) {
    
    const featuredTours = tours.filter(t => t.isFeatured && t.published);

    if (!featuredTours || featuredTours.length === 0) {
        return null;
    }
    
    return (
        <section id="featured-tours" className="py-24 bg-secondary flex flex-col items-center">
            <div className="container text-center mb-12">
                <p className="text-accent font-cursive font-bold text-lg">{dictionary.subtitle}</p>
                <h2 className="text-4xl md:text-5xl font-extrabold mt-2 text-foreground">{dictionary.title}</h2>
                <p className="mt-4 text-lg text-muted-foreground max-w-xl mx-auto">
                {dictionary.description}
                </p>
            </div>
            <div className="w-full px-4 md:px-0 md:w-[80vw] mx-auto">
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
                    {featuredTours.map((tour) => (
                       <TourCard key={tour.id} tour={tour} lang={lang} />
                    ))}
                </div>
            </div>
      </section>
    );
}
