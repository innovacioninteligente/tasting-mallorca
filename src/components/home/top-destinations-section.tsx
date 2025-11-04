'use client';

import Image from 'next/image';
import { Badge } from '@/components/ui/badge';
import { ArrowUpRight, Sprout } from 'lucide-react';

const destinations = [
  {
    name: 'New York',
    listings: 12,
    image: 'https://picsum.photos/seed/ny/400/600',
    imageHint: 'new york city',
  },
  {
    name: 'London',
    listings: 22,
    image: 'https://picsum.photos/seed/london/400/600',
    imageHint: 'london city',
  },
  {
    name: 'San Francisco',
    listings: 10,
    image: 'https://picsum.photos/seed/sf/400/600',
    imageHint: 'san francisco bridge',
  },
  {
    name: 'Paris',
    listings: 12,
    image: 'https://picsum.photos/seed/paris/400/600',
    imageHint: 'paris eiffel tower',
  },
];

export function TopDestinationsSection() {
    return (
        <section className="py-24 bg-background">
            <div className="container text-center mb-12">
                <div className='flex justify-center items-center gap-2'>
                <Sprout className="w-6 h-6 text-primary" />
                <p className="text-primary font-cursive font-bold text-lg">Destinations</p>
                </div>
                <h2 className="text-4xl md:text-5xl font-extrabold mt-2">Top Destinations</h2>
                <p className="mt-4 text-lg text-muted-foreground max-w-xl mx-auto">
                Content of a page when looking at layout the point of using lorem the is Ipsum less
                </p>
            </div>
            <div className="w-full px-4 md:px-0 md:w-[90vw] mx-auto">
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
                {destinations.map((dest) => (
                    <div key={dest.name} className="relative rounded-2xl overflow-hidden group h-[400px]">
                    <Image
                        src={dest.image}
                        alt={dest.name}
                        fill
                        className="object-cover transition-transform duration-300 group-hover:scale-105"
                        data-ai-hint={dest.imageHint}
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent"></div>
                    <div className="absolute bottom-0 left-0 p-6 text-white">
                        <h3 className="text-2xl font-bold">{dest.name}</h3>
                        <Badge variant="secondary" className="mt-2 bg-white/30 text-white backdrop-blur-sm border-0">
                        {dest.listings} Listing
                        </Badge>
                    </div>
                    <div className="absolute top-4 right-4 h-12 w-12 bg-primary rounded-full flex items-center justify-center transform transition-transform duration-300 group-hover:rotate-45">
                        <ArrowUpRight className="h-6 w-6 text-primary-foreground" />
                    </div>
                    </div>
                ))}
                </div>
            </div>
        </section>
    );
}
