'use client';

import { type Locale } from '@/dictionaries/config';
import { Tour } from '@/backend/tours/domain/tour.model';
import { TourCard } from '@/components/tour-card';

interface RelatedToursSectionProps {
    title: string;
    lang: Locale;
    tours: Tour[];
}

export function RelatedToursSection({ title, lang, tours }: RelatedToursSectionProps) {
    if (!tours || tours.length === 0) {
        return null;
    }

    return (
        <section className="bg-background py-16 border-t border-border/40">
            <div className="w-full md:w-[80vw] mx-auto px-4">
                <h2 className="text-3xl font-bold mb-8">{title}</h2>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
                    {tours.map((tour) => (
                        <TourCard key={tour.id} tour={tour} lang={lang} />
                    ))}
                </div>
            </div>
        </section>
    );
}
