
'use client';

import Image from 'next/image';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Heart, ArrowRight } from 'lucide-react';
import { Tour } from '@/backend/tours/domain/tour.model';
import { Locale } from '@/dictionaries/config';

interface TourCardProps {
    tour: Tour;
    lang: Locale;
}

export function TourCard({ tour, lang }: TourCardProps) {
    const slug = tour.slug[lang] || tour.slug.en;
    const title = tour.title[lang] || tour.title.en;
    const description = tour.description[lang] || tour.description.en;

    return (
        <Link
            href={`/${lang}/tours/${slug}`}
            className="block group"
            prefetch={false}
        >
            <div className="bg-card rounded-2xl overflow-hidden shadow-lg h-full flex flex-col cursor-pointer">
                <div className="relative h-80">
                    <Image
                        src={tour.mainImage}
                        alt={title}
                        fill
                        className="object-cover transition-transform duration-300 group-hover:scale-105 view-transition"
                        style={{ viewTransitionName: `tour-image-${slug}` } as React.CSSProperties}
                        sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
                    />
                    <Button size="icon" variant="secondary" className="absolute top-4 right-4 rounded-full h-9 w-9 bg-white/20 backdrop-blur-sm border-0 text-white hover:bg-white/30">
                        <Heart className="h-5 w-5" />
                    </Button>
                </div>
                <div className="p-5 flex flex-col flex-grow">
                    <h3 className="text-xl font-bold mb-2">{title}</h3>
                    <p className="text-muted-foreground text-sm mb-4 flex-grow">{description}</p>
                    <div className="flex justify-between items-center mt-auto">
                        <span className="text-xl font-extrabold text-primary">€{tour.price}</span>
                        <div className="rounded-full bg-primary/10 text-primary h-10 w-10 flex items-center justify-center group-hover:bg-primary/20">
                            <ArrowRight className="h-5 w-5" />
                        </div>
                    </div>
                </div>
            </div>
        </Link>
    );
}
