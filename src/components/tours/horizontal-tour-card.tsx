
'use client';

import Image from 'next/image';
import Link from 'next/link';
import { ArrowRight, Clock } from 'lucide-react';
import { Tour } from '@/backend/tours/domain/tour.model';
import { Locale } from '@/dictionaries/config';

interface HorizontalTourCardProps {
    tour: Tour;
    lang: Locale;
}

export function HorizontalTourCard({ tour, lang }: HorizontalTourCardProps) {
    const slug = tour.slug[lang as keyof typeof tour.slug] || tour.slug.en;
    const title = tour.title[lang as keyof typeof tour.title] || tour.title.en;

    return (
        <Link
            href={`/${lang}/tours/${slug}`}
            className="block group bg-card rounded-lg overflow-hidden shadow-lg hover:shadow-xl transition-shadow border border-border/20 hover:border-primary/30"
            prefetch={false}
        >
            <div className="flex h-full">
                <div className="relative w-2/5 flex-shrink-0 h-40">
                    <Image
                        src={tour.mainImage}
                        alt={title}
                        fill
                        className="object-cover transition-transform duration-300 group-hover:scale-105"
                        sizes="(max-width: 1023px) 40vw, 20vw"
                    />
                </div>
                <div className="p-4 flex flex-col justify-between flex-grow">
                    <div>
                        <h3 className="text-lg font-bold leading-tight mb-2">{title}</h3>
                        <div className="flex items-center gap-2 text-sm text-muted-foreground">
                            <Clock className="h-4 w-4" />
                            <span>{tour.durationHours} hours</span>
                        </div>
                    </div>
                    <div className="flex justify-between items-center mt-3">
                        <span className="text-lg font-extrabold text-primary">€{tour.price}</span>
                        <div className="rounded-full bg-primary/10 text-primary h-8 w-8 flex items-center justify-center group-hover:bg-primary/20">
                            <ArrowRight className="h-4 w-4" />
                        </div>
                    </div>
                </div>
            </div>
        </Link>
    );
}

