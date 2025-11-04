'use client';

import Image from 'next/image';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Heart, ArrowRight } from 'lucide-react';
import { type Locale } from '@/dictionaries/config';
import { type getDictionary } from '@/dictionaries/get-dictionary';

type FeaturedToursProps = {
    dictionary: Awaited<ReturnType<typeof getDictionary>>;
    lang: Locale;
}

export function FeaturedToursSection({ dictionary, lang }: FeaturedToursProps) {
    return (
        <section className="py-24 bg-secondary">
            <div className="container text-center mb-12">
                <p className="text-primary font-cursive font-bold text-lg">Featured Tours</p>
                <h2 className="text-4xl md:text-5xl font-extrabold mt-2">Amazing Tours</h2>
                <p className="mt-4 text-lg text-muted-foreground max-w-xl mx-auto">
                Discover our handpicked selection of the most popular and breathtaking tours.
                </p>
            </div>
            <div className="w-full px-4 md:px-0 md:w-[90vw] mx-auto">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
                {dictionary.tours.map((tour) => (
                    <Link
                        key={tour.id}
                        href={`/${lang}/tours/${tour.slug}`}
                        className="block group"
                        prefetch={false}
                    >
                        <div className="bg-card rounded-2xl overflow-hidden shadow-lg h-full flex flex-col cursor-pointer">
                            <div className="relative h-80">
                                <Image
                                    src={tour.image}
                                    alt={tour.title}
                                    fill
                                    className="object-cover transition-transform duration-300 group-hover:scale-105 view-transition"
                                    style={{ '--view-transition-name': `tour-image-${tour.slug}` } as React.CSSProperties}
                                />
                                <Button size="icon" variant="secondary" className="absolute top-4 right-4 rounded-full h-9 w-9 bg-white/20 backdrop-blur-sm border-0 text-white hover:bg-white/30">
                                    <Heart className="h-5 w-5" />
                                </Button>
                            </div>
                            <div className="p-5 flex flex-col flex-grow">
                                <h3 className="text-xl font-bold mb-2">{tour.title}</h3>
                                <p className="text-muted-foreground text-sm mb-4 flex-grow">{tour.description}</p>
                                <div className="flex justify-between items-center mt-auto">
                                    <span className="text-xl font-extrabold text-primary">${tour.price}</span>
                                    <div className="rounded-full bg-primary/10 text-primary h-10 w-10 flex items-center justify-center group-hover:bg-primary/20">
                                        <ArrowRight className="h-5 w-5" />
                                    </div>
                                </div>
                            </div>
                        </div>
                    </Link>
                ))}
            </div>
            </div>
      </section>
    );
}
