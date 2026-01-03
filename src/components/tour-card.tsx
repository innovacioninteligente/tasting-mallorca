
'use client';

import Image from 'next/image';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Heart, ArrowRight, ImageIcon } from 'lucide-react';
import { Tour } from '@/backend/tours/domain/tour.model';
import { Locale } from '@/dictionaries/config';

interface TourCardProps {
    tour: Tour;
    lang: Locale;
}

export function TourCard({ tour, lang }: TourCardProps) {
    const slug = tour.slug[lang as keyof typeof tour.slug] || tour.slug.en;
    const title = tour.title[lang as keyof typeof tour.title] || tour.title.en;
    const description = tour.description[lang as keyof typeof tour.description] || tour.description.en;

    const fromLabel = {
        en: 'From',
        es: 'Desde',
        de: 'Ab',
        fr: 'À partir de',
        nl: 'Vanaf'
    };

    return (
        <Link
            href={`/${lang}/tours/${slug}`}
            className="block group h-full"
            prefetch={false}
        >
            <div className="bg-card rounded-xl overflow-hidden border border-border/50 shadow-sm transition-all duration-300 hover:shadow-lg hover:-translate-y-1 h-full flex flex-col">
                <div className="relative aspect-[4/3] bg-secondary overflow-hidden">
                    {tour.mainImage ? (
                        <>
                            <Image
                                src={tour.mainImage}
                                alt={title}
                                fill
                                className="object-cover transition-transform duration-500 group-hover:scale-110"
                                style={{ viewTransitionName: `tour-image-${slug}` } as React.CSSProperties}
                                sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
                            />
                            <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                            <Button size="icon" variant="secondary" className="absolute top-4 right-4 rounded-full h-8 w-8 bg-white/90 backdrop-blur-md text-foreground shadow-sm hover:bg-white transition-colors" aria-label="Add to favorites">
                                <Heart className="h-4 w-4" />
                            </Button>
                        </>
                    ) : (
                        <div className="flex items-center justify-center w-full h-full text-muted-foreground/20">
                            <ImageIcon className="w-12 h-12" />
                        </div>
                    )}
                </div>
                <div className="p-5 flex flex-col flex-grow">
                    <h3 className="text-lg font-bold mb-2 leading-tight group-hover:text-primary transition-colors line-clamp-2">{title}</h3>
                    <p className="text-muted-foreground text-sm mb-4 line-clamp-3">{description}</p>
                    <div className="flex justify-between items-end mt-auto pt-4 border-t border-border/50">
                        <div className="flex flex-col">
                            <span className="text-xs text-muted-foreground font-medium uppercase tracking-wider">{fromLabel[lang] || 'From'}</span>
                            <span className="text-xl font-extrabold text-foreground">€{tour.price}</span>
                        </div>
                        <div className="rounded-full bg-primary text-primary-foreground h-9 w-9 flex items-center justify-center shadow-md transform transition-transform group-hover:scale-110 group-active:scale-95">
                            <ArrowRight className="h-4 w-4" />
                        </div>
                    </div>
                </div>
            </div>
        </Link>
    );
}
