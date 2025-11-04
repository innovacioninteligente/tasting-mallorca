'use client';

import Image from 'next/image';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Star, Heart, MapPin } from 'lucide-react';

const featuredTours = [
  {
    title: 'Turkish Waves',
    location: 'US, Alaska',
    price: 385,
    rating: 5.0,
    reviews: 245,
    discount: '40% off',
    image: 'https://picsum.photos/seed/turkey/600/800',
    imageHint: 'turkey coast waves',
  },
  {
    title: 'Rome Waves',
    location: 'Rome',
    price: 395,
    rating: 5.0,
    reviews: 245,
    discount: '60% off',
    image: 'https://picsum.photos/seed/rome-waves/600/800',
    imageHint: 'rome waves',
  },
  {
    title: 'United Waves',
    location: 'US, Florida',
    price: 365,
    rating: 5.0,
    reviews: 245,
    discount: '20% off',
    image: 'https://picsum.photos/seed/florida-waves/600/800',
    imageHint: 'florida waves',
  },
  {
    title: 'Mallorca Dreams',
    location: 'Spain, Mallorca',
    price: 420,
    rating: 4.9,
    reviews: 310,
    discount: '30% off',
    image: 'https://picsum.photos/seed/mallorca-dreams/600/800',
    imageHint: 'mallorca beach',
  },
];

export function FeaturedToursSection() {
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
                {featuredTours.map((tour) => (
                <div key={tour.title} className="bg-card rounded-2xl overflow-hidden group shadow-lg">
                    <div className="relative h-64">
                    <Image
                        src={tour.image}
                        alt={tour.title}
                        fill
                        className="object-cover transition-transform duration-300 group-hover:scale-105"
                        data-ai-hint={tour.imageHint}
                    />
                    <Badge className="absolute top-4 left-4 bg-yellow-400 text-black border-none font-bold">{tour.discount}</Badge>
                    <Button size="icon" variant="secondary" className="absolute top-4 right-4 rounded-full h-9 w-9 bg-white/20 backdrop-blur-sm border-0 text-white hover:bg-white/30">
                        <Heart className="h-5 w-5" />
                    </Button>
                    </div>
                    <div className="p-5">
                    <Badge variant="outline" className="border-primary text-primary mb-3">Featured</Badge>
                    <h3 className="text-xl font-bold">Over {tour.title}</h3>
                    <p className="text-2xl font-extrabold text-primary mb-4">${tour.price.toFixed(2)}</p>
                    <div className="flex items-center text-sm text-muted-foreground gap-4">
                        <div className="flex items-center gap-1">
                        <Star className="w-4 h-4 text-yellow-400 fill-yellow-400" />
                        <span className="font-bold">{tour.rating}</span> 
                        <span>({tour.reviews} Rating)</span>
                        </div>
                        <div className="flex items-center gap-1">
                            <MapPin className="w-4 h-4" />
                            <span>{tour.location}</span>
                        </div>
                    </div>
                    </div>
                </div>
                ))}
            </div>
            </div>
      </section>
    );
}
